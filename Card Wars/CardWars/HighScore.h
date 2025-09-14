#pragma once
#include <string>
#include <vector>
#include <sstream>
#include <iostream>
#include <fstream>

class HighScore

{
private:
	std::string name;
	int score;

public:
	//Getters
	std::string Name()
	{
		return name;
	}

	int Score()
	{
		return score;
	}
	//Setters
	void Name(std::string _name)
	{
		name = _name;
	}

	void Score(int _score)
	{
		score = _score;
	}

	HighScore(std::string _name, int _score) : name(_name), score(_score) {}

	HighScore(std::string csvData, char delimiter);

	void Deserialize(std::string csvData, char delimiter);

	static std::vector<HighScore> LoadHighScores(std::string filePath);

	static void ShowHighScores(std::vector<HighScore>const& scores);

	void Serialize(std::ofstream& outFile, char delimiter);

	static void SaveHighScores(std::string filePath, std::vector<HighScore>const& highscores);
};

