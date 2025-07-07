package config

import (
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/shem958/cycle-backend/models"
)

var DB *gorm.DB

func ConnectDB() {
	// Load .env for configs like JWT secret
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, continuing without it")
	}

	// Connect to SQLite DB
	database, err := gorm.Open(sqlite.Open("cycles.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate both Cycle and User models
	err = database.AutoMigrate(&models.Cycle{}, &models.User{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate database schema: %v", err)
	}

	DB = database
}
