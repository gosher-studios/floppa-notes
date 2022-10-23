mod auth;
mod config;
mod notes;

use tide::security::CorsMiddleware;
use mongodb::{Client as MongoClient, Collection};
use reqwest::Client;
use log::info;
use crate::config::Config;
use crate::notes::Note;

pub type Result<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[derive(Clone)]
pub struct State {
  reqwest: Client,
  config: Config,
  notes: Collection<Note>,
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
      notes: db.collection("notes"),
    })
  }
}

#[async_std::main]
async fn main() -> Result {
  tide::log::start();
  let config = Config::load("api.toml");
  let mut app = tide::with_state(State::new(config.clone()).await?);
  app.with(CorsMiddleware::new());
  app.at("notes/:id").get(notes::get).post(notes::update);
  app.at("auth/callback").get(auth::callback);
  app.listen(config.listen).await?;
  Ok(())
}
