const subscriptions = {} // Simplified example to keep track of subscriptions

exports.subscribe = (req, res) => 
{
   const { subscriberId, topic } = req.body
   subscriptions[subscriberId] = (subscriptions[subscriberId] || new Set()).add(
      topic,
   )
   console.log(`Subscriber ${subscriberId} added to topic ${topic}`)
   res.status(200).json({ message: `Subscribed to topic ${topic}` })
}

exports.unsubscribe = (req, res) => 
{
   const { subscriberId, topic } = req.body
   if (subscriptions[subscriberId]?.has(topic)) 
   {
      subscriptions[subscriberId].delete(topic)
      console.log(`Subscriber ${subscriberId} removed from topic ${topic}`)
      res.status(200).json({ message: `Unsubscribed from topic ${topic}` })
   }
   else 
   {
      res.status(404).json({
         message: `Subscription not found for topic ${topic}`,
      })
   }
}
