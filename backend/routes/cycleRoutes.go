
package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/controllers"
	"github.com/shem958/cycle-backend/middleware"
)

func RegisterCycleRoutes(router *gin.Engine) {
	api := router.Group("/api")

	api.GET("/cycles", controllers.GetCycles) // public route

	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())

	protected.POST("/cycles", controllers.AddCycle)
	protected.PUT("/cycles/:id", controllers.UpdateCycle)
	protected.DELETE("/cycles/:id", controllers.DeleteCycle)
}
