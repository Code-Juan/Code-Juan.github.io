#include "Player.h"

bool Player::HasCards()
{
	if (pile.size() > 0)
		return true;
	else
		return false;
}

void Player::PushCard(Card cardToPush)
{
	pile.push_back(cardToPush);
}

Card Player::PopCard()
{
	int cardIndex = rand() % pile.size();

	while (cardIndex >= pile.size())
		cardIndex = rand() % pile.size();

	Card removedCard = pile[cardIndex];
	pile.erase(pile.begin() + cardIndex);

	return removedCard;
}

void Player::WonCards(std::vector<Card> cardsWon)
{
	for (size_t i = 0; i < cardsWon.size(); i++)
	{
		won.push_back(cardsWon[i]);
	}
	Score(Score() + cardsWon.size());
}