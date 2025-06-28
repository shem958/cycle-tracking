package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/config"
	"github.com/shem958/cycle-backend/controllers"
)

func main() {
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // your frontend domain
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	config.ConnectDB()

	r.GET("/api/cycles", controllers.GetCycles)
	r.POST("/api/cycles", controllers.AddCycle)

	r.Run(":8080")
}
