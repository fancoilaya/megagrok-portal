export default function handler(req, res){
  // Simple placeholder: returns a future timestamp for CA launch
  const now = Date.now()
  const twoWeeks = 14 * 24 * 60 * 60 * 1000
  res.status(200).json({launchAt: now + twoWeeks})
}
