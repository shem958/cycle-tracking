package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/config"
	"github.com/shem958/cycle-backend/models"
)

func GetCycles(c *gin.Context) {
	var cycles []models.Cycle

	if err := config.DB.Find(&cycles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cycles"})
		return
	}

	c.JSON(http.StatusOK, cycles)
}

func AddCycle(c *gin.Context) {
	var cycle models.Cycle

	// Validate request JSON against binding rules
	if err := c.ShouldBindJSON(&cycle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	// Create cycle in DB
	if err := config.DB.Create(&cycle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save cycle entry",
		})
		return
	}

	c.JSON(http.StatusCreated, cycle)
}
