pub mod r;
pub mod idea;
pub mod user;

pub use idea::{Idea, LaunchRequest};
// Note: re-export user types only when needed to avoid unused import warnings
