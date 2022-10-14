use log::LevelFilter;
use tide::{Result, Request};

const LISTEN: &str = "127.0.0.1:4040";

#[tokio::main]
async fn main() -> Result<()> {
  env_logger::builder().filter_level(LevelFilter::Info).init();
  let mut app = tide::new();
  app.at("/").get(hi);
  app.listen(LISTEN).await?;
  Ok(())
}

async fn hi(_: Request<()>) -> tide::Result {
  Ok("hi".into())
}
