#pragma once
#include <string>
#include <vector>
#include "Card.h"
#include "HighScore.h"
#include "Player.h"
#include "Console.h"

class WarGame
{

public:
	WarGame(std::string cardsFile);

	static void LoadCards(std::string filePath);

	static void ShowCards();


	void PlayGame(std::string playerName, std::vector<HighScore>& highscores, std::string scoreFile);

private:
	static std::vector<Card> _cards;

	static void shuffle();
};

