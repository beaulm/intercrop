#include <iostream>
#include <vector>

#include "rapidjson/include/rapidjson/document.h"

using namespace rapidjson;

class Plant;
class Affinity;

class Affinity
{
   public:
      int type;
      int strength;
      Plant *plant;
};

class Plant
{
   public:
      int id;
      int size;
      std::vector<Affinity*> affinities;
      void display(bool);
};

void Plant::display(bool includeAffinities) {
	std::cout << "id\tsize\n";
	std::cout << this->id << "\t" << size << "\n";
	if(includeAffinities) {
		for(int i = 0; i < this->affinities.size(); i++) {
			std::cout << "affinities...\n";
			this->affinities.at(i)->plant->display(false);
		}
	}
}

int main(int argc, char* argv[])
{
	std::cout << argc << "\n";
	std::cout << argv[0] << "\n";
	std::cout << argv[1] << "\n";

	Document d;
	d.parse(argv[1]);
	// rapidjson::Value& s = d["stars"];
	// std::cout << s.GetInt() << "\n";

	// Plant *p1 = new Plant;
	// p1->id = 1;
	// p1->size = 5;

	// Plant *p2 = new Plant;
	// p2->id = 2;
	// p2->size = 2;

	// Affinity *a = new Affinity;
	// a->type = 1;
	// a->strength = 5;
	// a->plant = p2;

	// // p1->affinities.
	
	// p1->affinities.push_back(a);
	// p1->display(true);

	// p2->size=500;

	// p1->display(true);
}