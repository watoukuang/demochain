pub mod r;
pub mod idea;
pub mod user;
pub mod payment;

pub use idea::{Idea, LaunchRequest};
// Note: re-export user types only when needed to avoid unused import warnings
