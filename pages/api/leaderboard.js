export default function handler(req, res){
  const leaderboard = [
    {rank:1, user:'Froggy#1', xp:15200},
    {rank:2, user:'HopLord', xp:12400},
    {rank:3, user:'OGGrok', xp:11900}
  ]
  res.status(200).json(leaderboard)
}
