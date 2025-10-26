mod models;
mod service;
mod utils;
mod app;
mod bootstrap;
mod router;
mod handlers;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    app::run().await
}
