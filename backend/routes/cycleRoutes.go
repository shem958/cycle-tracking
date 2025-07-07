package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/controllers"
)

func RegisterCycleRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/cycles", controllers.GetCycles)
		api.POST("/cycles", controllers.AddCycle)
		api.PUT("/cycles/:id", controllers.UpdateCycle)
		api.DELETE("/cycles/:id", controllers.DeleteCycle)
	}
}
