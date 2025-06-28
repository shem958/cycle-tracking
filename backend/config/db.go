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
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database, err := gorm.Open(sqlite.Open("cycles.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	// Auto-migrate the Cycle model
	err = database.AutoMigrate(&models.Cycle{})
	if err != nil {
		log.Fatal("Failed to auto-migrate database")
	}

	DB = database
}
