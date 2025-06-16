using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Services.Kafka.Alert
{
    public interface IKafkaAlertConsumer
    {
        Task StartConsumingAsync(CancellationToken cancellationToken);
    }
}