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
	// Load .env if present, warn if missing but don’t exit
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// Connect to SQLite DB
	database, err := gorm.Open(sqlite.Open("cycles.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	if err := database.AutoMigrate(&models.Cycle{}); err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}

	DB = database
}
