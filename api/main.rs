mod auth;
mod config;

use tide::{Request, Response, Error};
use tide::security::CorsMiddleware;
use mongodb::{Client as MongoClient, Collection};
use serde::{Deserialize, Serialize};
use reqwest::Client;
use log::{LevelFilter, info};
use crate::config::Config;

pub type Result<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[derive(Serialize, Deserialize)]
struct User {
  username: String,
}

#[derive(Clone)]
pub struct State {
  reqwest: Client,
  config: Config,
  users: Collection<User>,
}

impl State {
  async fn new(config: Config) -> Result<Self> {
    let db = MongoClient::with_uri_str(config.db.clone())
      .await?
      .database("floppa-notes");
    info!("Connected to MongoDB.");
    Ok(Self {
      reqwest: Client::builder().user_agent("floppa notes").build()?,
      config,
      users: db.collection("users"),
    })
  }
}

#[async_std::main]
async fn main() -> Result {
  env_logger::builder().filter_level(LevelFilter::Info).init();
  let config = Config::load("api.toml");
  let mut app = tide::with_state(State::new(config.clone()).await?);
  app.with(CorsMiddleware::new());
  app.at("test").get(test);
  app.at("auth/callback").get(auth::callback);
  app.listen(config.listen).await?;
  Ok(())
}

async fn test(req: Request<State>) -> Result<Response, Error> {
  let count = req.state().users.count_documents(None, None).await?;
  Ok(count.to_string().into())
}
