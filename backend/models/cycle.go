package models

import "gorm.io/gorm"

type Cycle struct {
	gorm.Model
	StartDate string `json:"startDate"`
	Length    int    `json:"length"`
	Mood      string `json:"mood"`
	Symptoms  string `json:"symptoms"`
}
