use bcrypt::{hash, verify, DEFAULT_COST};
use anyhow::{Result, anyhow};

pub struct PasswordService;

impl PasswordService {
    /// 哈希密码
    pub fn hash_password(password: &str) -> Result<String> {
        hash(password, DEFAULT_COST)
            .map_err(|e| anyhow!("Failed to hash password: {}", e))
    }

    /// 验证密码
    pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
        verify(password, hash)
            .map_err(|e| anyhow!("Failed to verify password: {}", e))
    }

    /// 验证密码强度
    pub fn validate_password_strength(password: &str) -> Result<()> {
        if password.len() < 6 {
            return Err(anyhow!("密码长度至少为6位"));
        }

        if password.len() > 128 {
            return Err(anyhow!("密码长度不能超过128位"));
        }

        // 可以添加更多密码强度检查
        // 例如：必须包含数字、字母、特殊字符等

        Ok(())
    }
}
