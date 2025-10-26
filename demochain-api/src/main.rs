mod models;
mod service;
mod utils;
mod app;
mod bootstrap;
mod router;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    app::run().await
}
