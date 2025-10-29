#!/usr/bin/env bash
# Build script for demochain-api on Ubuntu 22.04
# demochain-api 在 Ubuntu 22.04 上的构建脚本
# - Verifies OS and Rust toolchain assumptions
#   检查系统版本与 Rust 工具链
# - Optional system deps install via --install-deps (requires sudo)
#   可选安装系统依赖（需要 sudo）
# - Builds release binary with Cargo
#   使用 Cargo 构建 release 可执行文件
# - Exports artifacts to ./dist
#   将构建产物导出到 ./dist 目录

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

log()  { echo -e "\033[1;34m[build]\033[0m $*"; }
warn() { echo -e "\033[1;33m[warn]\033[0m $*"; }
err()  { echo -e "\033[1;31m[error]\033[0m $*"; }

HAS_SUDO=0
if command -v sudo >/dev/null 2>&1; then HAS_SUDO=1; fi

command_exists() { command -v "$1" >/dev/null 2>&1; }

usage() {
  cat <<EOF
Usage: ./build.sh [options]
用法:  ./build.sh [选项]

Options / 选项:
  --install-deps    Install required system packages
                    安装系统依赖（build-essential, pkg-config, libssl-dev, openssl, ca-certificates）
  --clean           Run cargo clean before building
                    在构建前执行 cargo clean
  --target <triple> Explicit cargo build target (default: host, e.g. x86_64-unknown-linux-gnu)
                    指定构建目标三元组（默认主机架构）
  --out-name <name> Rename the output binary in dist to <name>
                    将导出的可执行文件重命名为 <name>
  -h, --help        Show this help
                    显示此帮助
EOF
}

INSTALL_DEPS=0
CLEAN_FIRST=0
TARGET=""
# Default output binary name without passing parameters
# 默认输出二进制名称（无需传参）
OUT_NAME="demochain"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --install-deps) INSTALL_DEPS=1; shift ;;
    --clean) CLEAN_FIRST=1; shift ;;
    --target) TARGET="$2"; shift 2 ;;
    --out-name) OUT_NAME="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

check_os() {
  if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    if [[ "${ID:-}" != "ubuntu" ]]; then
      # 非 Ubuntu 系统，仅提示，不强制中断
      warn "Non-Ubuntu system detected: ${ID:-unknown}. Continuing, but script was tested on Ubuntu 22.04."
    fi
    if [[ "${VERSION_ID:-}" != "22.04" ]]; then
      # Ubuntu 版本不是 22.04，提示推荐版本
      warn "Ubuntu version is ${VERSION_ID:-unknown}, recommended is 22.04."
    fi
  else
    # 无法识别系统版本，跳过检查
    warn "/etc/os-release not found. Skipping OS checks."
  fi
}

install_deps() {
  if [[ $INSTALL_DEPS -eq 1 ]]; then
    if ! command_exists apt-get; then
      # 非 Debian/Ubuntu 系，无法自动安装系统依赖
      err "apt-get not found. Cannot install system deps automatically."
      exit 1
    fi
    if [[ $HAS_SUDO -eq 0 ]]; then
      # 无 sudo，无法安装依赖
      err "sudo not available. Please run with sudo or install deps manually."
      exit 1
    fi
    log "Installing system dependencies... 正在安装系统依赖..."
    sudo apt-get update -y
    sudo apt-get install -y \
      build-essential pkg-config libssl-dev openssl ca-certificates
  fi
}

require_rust() {
  if ! command_exists cargo || ! command_exists rustc; then
    # 未安装 Rust 工具链，提示安装方式
    err "Rust toolchain not found. Install via rustup:"
    echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "  source \"$HOME/.cargo/env\""
    exit 1
  fi
  # Recommend toolchain >= 1.67 (Axum commonly needs newer)
  # 建议 rustc 版本 >= 1.67（Axum 通常需要较新的版本）
  local v
  v=$(rustc --version | awk '{print $2}')
  log "Detected rustc $v"
}

cargo_build() {
  if [[ $CLEAN_FIRST -eq 1 ]]; then
    # 构建前清理
    log "Cleaning previous artifacts... 清理旧的构建产物..."
    cargo clean
  fi
  local args=(build --release)
  if [[ -n "$TARGET" ]]; then
    args+=(--target "$TARGET")
  fi
  # 开始构建
  log "Running: cargo ${args[*]} 开始构建"
  cargo "${args[@]}"
}

export_artifacts() {
  local dist="$PROJECT_DIR/dist"
  rm -rf "$dist"
  mkdir -p "$dist"

  local bin_dir
  if [[ -n "$TARGET" ]]; then
    bin_dir="$PROJECT_DIR/target/$TARGET/release"
  else
    bin_dir="$PROJECT_DIR/target/release"
  fi

  if [[ ! -d "$bin_dir" ]]; then
    err "Build output not found: $bin_dir"
    exit 1
  fi

  # Copy all executable files in release dir (excluding *.d, *.rlib, *.so, etc.)
  # 仅复制可执行文件（排除 .d/.rlib/.so 等文件）
  shopt -s nullglob
  local copied=0
  for f in "$bin_dir"/*; do
    if [[ -f "$f" && -x "$f" && ! "$f" == *.d && ! "$f" == *.so && ! "$f" == *.rlib ]]; then
      cp -f "$f" "$dist/"
      ((copied++)) || true
    fi
  done
  shopt -u nullglob

  if [[ $copied -eq 0 ]]; then
    # 未找到可执行产物，提示检查 Cargo.toml 是否定义了二进制
    warn "No executables copied from $bin_dir. Ensure your Cargo.toml defines a binary package."
  else
    log "Copied $copied executable(s) to dist/ 已复制 $copied 个可执行文件到 dist/"
  fi

  # Include ancillary files if present
  # 附带拷贝一些常见配置/说明文件（如果存在）
  for extra in README.md .env.sample .env config*; do
    if [[ -e "$PROJECT_DIR/$extra" ]]; then
      cp -r "$PROJECT_DIR/$extra" "$dist/" || true
    fi
  done

  log "Artifacts are in $dist 构建产物已生成到 $dist"

  # If requested, rename the main binary to OUT_NAME
  if [[ -n "$OUT_NAME" ]]; then
    # Try to detect a likely main binary name (package name), fall back to first executable
    local target_bin
    # Prefer a file starting with project/package name if exists
    for f in "$dist"/*; do
      if [[ -f "$f" && -x "$f" ]]; then
        target_bin="$f"; break
      fi
    done
    if [[ -n "$target_bin" ]]; then
      local new_path="$dist/$OUT_NAME"
      mv -f "$target_bin" "$new_path"
      chmod +x "$new_path" || true
      log "Renamed executable to $OUT_NAME 已重命名可执行文件为 $OUT_NAME"
    else
      warn "No executable found to rename 未找到可重命名的可执行文件"
    fi
  fi
}

main() {
  check_os
  install_deps
  require_rust
  cargo_build
  export_artifacts
  log "Build finished successfully."
}

main "$@"
