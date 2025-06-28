package main

import (
	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/config"
	"github.com/shem958/cycle-backend/routes"
)

func main() {
	router := gin.Default()
	config.InitDB()
	routes.RegisterRoutes(router)
	router.Run(":8080")
}
