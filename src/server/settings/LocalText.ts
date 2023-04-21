type LocalTextLike = {
  identifier: string;
  replacements?: string[];
}

class LocalText {
  constructor()
}

let example = {
  id: "friend.request.accepted",
  text: "{user} has accepted your friend request. Start a conversation with {pronoun} now!",

  replacements: [
    {
      replace: "user",
      with: "data"
    },
    {
      replace: "pronoun",
      with: {
        male: "text/him",
        female: "text/her",
        other: "text/them"
      }
    }
  ]
}