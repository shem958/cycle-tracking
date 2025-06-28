package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shem958/cycle-backend/config"
	"github.com/shem958/cycle-backend/models"
)

func GetCycles(c *gin.Context) {
	var cycles []models.Cycle
	config.DB.Find(&cycles)
	c.JSON(http.StatusOK, cycles)
}

func AddCycle(c *gin.Context) {
	var cycle models.Cycle
	if err := c.ShouldBindJSON(&cycle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&cycle)
	c.JSON(http.StatusOK, cycle)
}
