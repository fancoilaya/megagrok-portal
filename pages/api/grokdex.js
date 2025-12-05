export default function handler(req, res){
  const data = [
    {id:1, name:'Grok (Tadpole)', rarity:'Common', hp:20},
    {id:2, name:'HopGoblin', rarity:'Rare', hp:60},
    {id:3, name:'Ascended', rarity:'Legendary', hp:200}
  ];
  res.status(200).json(data);
}
