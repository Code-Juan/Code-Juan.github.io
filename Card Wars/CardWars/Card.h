#pragma once
#include <string>
//----------------------------------------------------------------
//                                                              //
//		        DO NOT EDIT THE CODE BELOW                      //
//                                                              //
#if defined(_WIN32) || defined(__MSDOS__)
#define SPADE   '\x06'
#define CLUB    '\x05'
#define HEART   '\x03'
#define DIAMOND '\x04'
#else
#define SPADE   '\u2660'
#define CLUB    '\u2663'
#define HEART   '\u2665'
#define DIAMOND '\u2666'
#endif
class Card
{
public:
	Card(std::string suit, std::string face)
	{
		_suit = suit;
		_face = face;
	}

	std::string Suit() const { return _suit; }
	void Suit(std::string suit) { _suit = suit; }

	std::string Face() const { return _face; }
	void Face(std::string face) { _face = face; }

	void Print() const;
	int Compare(Card& otherCard) const;

private:
	std::string _suit;
	std::string _face;

	int Value(std::string face) const;
};

