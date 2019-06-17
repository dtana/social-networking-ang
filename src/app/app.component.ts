import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const users = [
  {
    "id": 1,
    "firstName": "Paul",
    "surname": "Crowe",
    "age": 28,
    "gender": "male",
    "friends": [
      2
    ]
  },
  {
    "id": 2,
    "firstName": "Rob",
    "surname": "Fitz",
    "age": 23,
    "gender": "male",
    "friends": [
      1,
      3
    ]
  },
  {
    "id": 3,
    "firstName": "Ben",
    "surname": "O'Carolan",
    "age": null,
    "gender": "male",
    "friends": [
      2,
      4,
      5,
      7
    ]
  },
  {
    "id": 4,
    "firstName": "Victor",
    "surname": "",
    "age": 28,
    "gender": "male",
    "friends": [
      3
    ]
  },
  {
    "id": 5,
    "firstName": "Peter",
    "surname": "Mac",
    "age": 29,
    "gender": "male",
    "friends": [
      3,
      6,
      11,
      10,
      7
    ]
  },
  {
    "id": 6,
    "firstName": "John",
    "surname": "Barry",
    "age": 18,
    "gender": "male",
    "friends": [
      5
    ]
  },
  {
    "id": 7,
    "firstName": "Sarah",
    "surname": "Lane",
    "age": 30,
    "gender": "female",
    "friends": [
      3,
      5,
      20,
      12,
      8
    ]
  },
  {
    "id": 8,
    "firstName": "Susan",
    "surname": "Downe",
    "age": 28,
    "gender": "female",
    "friends": [
      7
    ]
  },
  {
    "id": 9,
    "firstName": "Jack",
    "surname": "Stam",
    "age": 28,
    "gender": "male",
    "friends": [
      12
    ]
  },
  {
    "id": 10,
    "firstName": "Amy",
    "surname": "Lane",
    "age": 24,
    "gender": "female",
    "friends": [
      5,
      11
    ]
  },
  {
    "id": 11,
    "firstName": "Sandra",
    "surname": "Phelan",
    "age": 28,
    "gender": "female",
    "friends": [
      5,
      10,
      19,
      20
    ]
  },
  {
    "id": 12,
    "firstName": "Laura",
    "surname": "Murphy",
    "age": 33,
    "gender": "female",
    "friends": [
      7,
      9,
      13,
      20
    ]
  },
  {
    "id": 13,
    "firstName": "Lisa",
    "surname": "Daly",
    "age": 28,
    "gender": "female",
    "friends": [
      12,
      14,
      20
    ]
  },
  {
    "id": 14,
    "firstName": "Mark",
    "surname": "Johnson",
    "age": 28,
    "gender": "male",
    "friends": [
      13,
      15
    ]
  },
  {
    "id": 15,
    "firstName": "Seamus",
    "surname": "Crowe",
    "age": 24,
    "gender": "male",
    "friends": [
      14
    ]
  },
  {
    "id": 16,
    "firstName": "Daren",
    "surname": "Slater",
    "age": 28,
    "gender": "male",
    "friends": [
      18,
      20
    ]
  },
  {
    "id": 17,
    "firstName": "Dara",
    "surname": "Zoltan",
    "age": 48,
    "gender": "male",
    "friends": [
      18,
      20
    ]
  },
  {
    "id": 18,
    "firstName": "Marie",
    "surname": "D",
    "age": 28,
    "gender": "female",
    "friends": [
      17
    ]
  },
  {
    "id": 19,
    "firstName": "Catriona",
    "surname": "Long",
    "age": 28,
    "gender": "female",
    "friends": [
      11,
      20
    ]
  },
  {
    "id": 20,
    "firstName": "Katy",
    "surname": "Couch",
    "age": 28,
    "gender": "female",
    "friends": [
      7,
      11,
      12,
      13,
      16,
      17,
      19
    ]
  }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public model: any;
  users: any = users;
  selectedUser: string = null;
  friends: any = [];
  friendsFriends: any = [];
  suggestedFriends: any = [];
  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : users.filter(v => this.fullName(v).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  fullName = (item: {firstName: string, surname: string}) => item.firstName + " " + item.surname;

  showFriends (event: any) {
    this.selectedUser = this.fullName(event.item);

    // friends list
    let friendList = event.item.friends;
    
    // friends
    this.friends = this.users.filter(e => {
      if (friendList.includes(e.id)) return e;
    });
    
    // ff list
    let friensOfFriendsList: any;
    this.friends.forEach(e => {
      friensOfFriendsList = Array.from(new Set(friendList.concat(e.friends))).sort((a: number, b: number) => a - b);
    });

    // filtering ff list
    friensOfFriendsList = friensOfFriendsList.filter(e => {if (e != event.item.id && !friendList.includes(e)) return e})
    
    // friends of friends
    this.friendsFriends = this.users.filter(e => {
      if (friensOfFriendsList.includes(e.id)) return e;
    });

    // sugested friends list
    let suggestedFriendsList = [];
    this.friendsFriends.forEach(e => {
      suggestedFriendsList = friensOfFriendsList.concat(e.friends).sort((a: number, b: number) => a - b);
    });

    // filtering sf list
    let suggestedFriendsListFiltered = [];
    for (let i=1; i<suggestedFriendsList.length; i++) {
      if (suggestedFriendsList[i] == suggestedFriendsList[i-1]) suggestedFriendsListFiltered.push(suggestedFriendsList[i]);
    };

    // suggested friends
    this.suggestedFriends = this.users.filter((e) => {
      if (suggestedFriendsListFiltered.includes(e.id)) return e;
    });
  }
}
