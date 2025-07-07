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

	if err := c.ShouldBindJSON(&cycle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	if err := config.DB.Create(&cycle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save cycle entry"})
		return
	}

	c.JSON(http.StatusCreated, cycle)
}

func UpdateCycle(c *gin.Context) {
	id := c.Param("id")
	var cycle models.Cycle

	// Check if entry exists
	if err := config.DB.First(&cycle, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cycle not found"})
		return
	}

	var updated models.Cycle
	if err := c.ShouldBindJSON(&updated); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid update data", "details": err.Error()})
		return
	}

	cycle.StartDate = updated.StartDate
	cycle.Length = updated.Length
	cycle.Mood = updated.Mood
	cycle.Symptoms = updated.Symptoms

	if err := config.DB.Save(&cycle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cycle"})
		return
	}

	c.JSON(http.StatusOK, cycle)
}

func DeleteCycle(c *gin.Context) {
	id := c.Param("id")
	var cycle models.Cycle

	if err := config.DB.First(&cycle, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cycle not found"})
		return
	}

	if err := config.DB.Delete(&cycle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete cycle"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cycle deleted successfully"})
}
