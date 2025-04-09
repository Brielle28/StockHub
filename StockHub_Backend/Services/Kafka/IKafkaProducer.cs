using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Services.Kafka
{
    public interface IKafkaProducer
    {
         Task ProduceAsync(string topic, string message);
    }
}