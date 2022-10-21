use std::{fs, process};
use std::net::SocketAddr;
use serde::Deserialize;
use log::{info, error};

#[derive(Deserialize, Clone)]
pub struct Config {
  pub listen: SocketAddr,
  pub db: String,
  pub github_id: String,
  pub github_secret: String,
}

impl Config {
  pub fn load(filename: &str) -> Self {
    let str = match fs::read_to_string(filename) {
      Ok(s) => s,
      Err(_) => {
        error!("Could not read \"{}\"", filename);
        process::exit(1);
      }
    };
    match toml::from_str(&str) {
      Ok(c) => {
        info!("Loaded config \"{}\"", filename);
        c
      }
      Err(_) => {
        error!("Could not parse \"{}\"", filename);
        process::exit(1);
      }
    }
  }
}
