#pragma once
#include <string>
#include <vector>
#include "Card.h"
#include <memory>

class Player
{
	private:
	std::string name;
	int score;
	std::vector<Card> pile;
	std::vector<Card> won;

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


	bool HasCards();
	void PushCard(Card cardToPush);
	Card PopCard();
	void WonCards(std::vector<Card> cardsWon);
};

