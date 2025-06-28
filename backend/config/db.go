package config

import (
	"log"
	"github.com/joho/godotenv"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/shem958/cycle-backend/models"
)

var DB *gorm.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database, err := gorm.Open(sqlite.Open("cycles.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	database.AutoMigrate(&models.Cycle{})

	DB = database
}
