package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/controllers"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/cycles", controllers.GetCycles)
		api.POST("/cycles", controllers.AddCycle)
	}
}
