using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using StockHub_Backend.Services.Kafka;

public class KafkaProducer : IKafkaProducer
{
    private readonly string _bootstrapServers;

    public KafkaProducer(IConfiguration configuration)
    {
        _bootstrapServers = configuration["Kafka:BootstrapServers"];
    }

    public async Task ProduceAsync(string topic, string message)
    {
        var config = new ProducerConfig { BootstrapServers = _bootstrapServers };

        using var producer = new ProducerBuilder<Null, string>(config).Build();
        await producer.ProduceAsync(topic, new Message<Null, string> { Value = message });
    }
}
