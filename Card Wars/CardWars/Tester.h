#pragma once
#include <vector>
#include "ResultsLib.h"
class Tester
{
public:
	const char* file;
	Tester() : file("..\\..\\CardWars\\CardWars.log")
	{
		std::vector<std::string> codeFiles{ 
			"..\\..\\CardWars\\CardWars.cpp", 
			"..\\..\\CardWars\\WarGame.h", 
			"..\\..\\CardWars\\WarGame.cpp", 
			"..\\..\\CardWars\\Player.h", 
			"..\\..\\CardWars\\Player.cpp", 
			"..\\..\\CardWars\\HighScore.h", 
			"..\\..\\CardWars\\HighScore.cpp" };
		results::Log(file, codeFiles);
	}
};

