#include "WarGame.h"
#include <time.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include "Input.h"

std::vector<Card> WarGame::_cards;

WarGame::WarGame(std::string cardsFile)
{
    LoadCards(cardsFile);
}

void WarGame::shuffle()
{
    int ndx1, ndx2;
    srand((unsigned int)time(NULL));

    for (size_t i = 0; i < 52; i++)
    {
        ndx1 = rand() % 52;
        ndx2 = rand() % 52;

        Card temp = _cards[ndx1];
        _cards[ndx1] = _cards[ndx2];
        _cards[ndx2] = temp;
    }
}

void WarGame::LoadCards(std::string filePath)
{
    char delimiter = '?';
    char delimiter2 = '\n';
    std::vector<std::string> suits;
    std::vector<std::string> faces;
    
    std::ifstream cardStream(filePath);
    std::string suitsCSV,
                suit;
    int i = 0;
    while (std::getline(cardStream, suitsCSV, delimiter2))
    {
        if (i == 1)     //breaking here gets rid of '\n' in last char (i.e. 'K' instead of 'K\n')
            break;

        std::stringstream suitsDataStream(suitsCSV);
        while (std::getline(suitsDataStream, suit, delimiter))
        {
            suits.push_back(suit);
        }
        i++;
    }

    std::string facesCSV;
    std::stringstream faceStream(suitsCSV);
    while (std::getline(faceStream, facesCSV, delimiter))
    {
        faces.push_back(facesCSV);
    }

    for (size_t i = 0; i < suits.size(); i++)
    {
        for (size_t j = 0; j < faces.size(); j++)
        {
            _cards.push_back(Card(suits[i], faces[j]));
        }
    }
}

void WarGame::ShowCards()
{
    for (auto& card : _cards)
    {
        card.Print();
        std::cout << "\n";
    }
}

void WarGame::PlayGame(std::string playerName, std::vector<HighScore>& highscores, std::string scoreFile)
{
    shuffle();

    Player npc,
        player;

    npc.Name("NPC");
    player.Name(playerName);

    for (size_t i = 0; i < _cards.size(); i++)
    {
        if (i % 2 == 0)
            npc.PushCard(_cards[i]);
        else
            player.PushCard(_cards[i]);
    }

    std::vector<Card> unclaimedPile;

    while (player.HasCards() == true)
    {
        Card playerCardPop = player.PopCard(),
             npcCardPop = npc.PopCard();

        std::cout << "\n";
        playerCardPop.Print();
        std::cout << " vs. ";
        npcCardPop.Print();

        unclaimedPile.push_back(playerCardPop);
        unclaimedPile.push_back(npcCardPop);

        int compResult = playerCardPop.Compare(npcCardPop);

        if (compResult == -1)
        {
            npc.WonCards(unclaimedPile);

            unclaimedPile.clear();

            std::cout << " NPC wins!";
        }
        else if(compResult == 1)
        {
            player.WonCards(unclaimedPile);

            unclaimedPile.clear();

            std::cout << " " << playerName << " wins!";
        }
    }

    if (npc.Score() > player.Score())
        std::cout << "\n NPC wins.\t" << npc.Score() << " to " << player.Score();
    else if (player.Score() == npc.Score())
        std::cout << "\n It's a tie!\t" << npc.Score() << " to " << player.Score();
    else if (player.Score() > npc.Score())
    {
        std::cout << "\n " << playerName << " WINS!\t" << player.Score() << " to " << npc.Score();

        if (player.Score() >= highscores[highscores.size() - 1].Score())
        {
            HighScore playerHighScore(player.Name(), player.Score());

            if (player.Score() >= highscores[0].Score())
            {
                highscores.push_back(playerHighScore);

                highscores.pop_back();

                HighScore::SaveHighScores(scoreFile, highscores);

                std::cout << "\n_#_#_ NEW HIGH SCORE _#_#_\n";

                HighScore::ShowHighScores(highscores);
            }
            else
            {
                for (size_t i = 1; i < highscores.size(); i++)
                {
                    if (player.Score() <= highscores[i - 1].Score() && player.Score() >= highscores[i].Score())
                    {
                        auto index = highscores.begin() + i;
                        highscores.insert(index, playerHighScore);

                        highscores.pop_back();

                        HighScore::SaveHighScores(scoreFile, highscores);

                        std::cout << "\n_#_#_ NEW HIGH SCORE _#_#_\n";

                        HighScore::ShowHighScores(highscores);
                        break;
                    }
                }
            }
        }
    }

    int response = Input::GetInteger("\nDo you want to play again? (1: Yes, 2: No) ", 1, 2);

    if (response == 1)
    {
        Console::Clear();
        PlayGame(playerName, highscores, scoreFile);
    }
}