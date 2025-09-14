#include "HighScore.h"
#include "Console.h"
#include <iomanip>

HighScore::HighScore(std::string csvData, char delimiter)
{
	Deserialize(csvData, delimiter);
}

void HighScore::Deserialize(std::string csvData, char delimiter)
{
	std::string charStream;
	std::stringstream lineStream(csvData);

	std::getline(lineStream, charStream, '[');
	name = charStream;

	std::getline(lineStream, charStream, '[');
	score = std::stoi(charStream);
}

std::vector<HighScore> HighScore::LoadHighScores(std::string filePath)
{
	std::vector<HighScore> highscores;
	std::ifstream highscoresStream(filePath);
	std::string tempLine;
	char delimiter = '\n';

	while (std::getline(highscoresStream, tempLine, delimiter))
	{
		HighScore highscoreLine(tempLine, delimiter);

		highscores.push_back(highscoreLine);
	}

	highscoresStream.close();

	return highscores;
}

void HighScore::ShowHighScores(std::vector<HighScore>const& scores)
{
	std::cout << "----HIGH SCORES----" << "\n";

	for (auto& item : scores)
	{
		Console::SetCursorLeft(0);
		Console::Write(item.name);
		Console::SetCursorLeft(18);
		Console::WriteLine(std::to_string(item.score), Yellow);
	}
}

void HighScore::Serialize(std::ofstream& outFile, char delimiter)
{
	outFile << name << delimiter << score << "\n";
}

void HighScore::SaveHighScores(std::string filePath, std::vector<HighScore>const& highscores)
{
	std::ofstream file(filePath);
	for (auto score : highscores)
	{
		score.Serialize(file, '[');
	}
}