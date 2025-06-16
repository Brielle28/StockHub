using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Alert;

namespace StockHub_Backend.Services.Kafka.Alert
{
    public interface IKafkaAlertProducer
    {
        Task PublishAlertTriggeredAsync(AlertTriggeredDTO alertTriggered);
    }
}