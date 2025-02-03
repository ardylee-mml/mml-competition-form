CREATE DATABASE IF NOT EXISTS MML_game_competition;
USE MML_game_competition;

CREATE TABLE applications (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    discord_id VARCHAR(255) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    team_members TEXT NOT NULL,
    team_experience TEXT NOT NULL,
    previous_projects TEXT NOT NULL,
    team_experience_description TEXT NOT NULL,
    game_genre VARCHAR(255) NOT NULL,
    game_title VARCHAR(255) NOT NULL,
    game_concept TEXT NOT NULL,
    why_win TEXT NOT NULL,
    why_players_like TEXT NOT NULL,
    promotion_plan TEXT NOT NULL,
    monetization_plan TEXT NOT NULL,
    projected_dau INT NOT NULL,
    day_one_retention INT NOT NULL,
    development_timeline TEXT NOT NULL,
    resources_tools TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);