library(ggplot2)
library(dplyr)

appointments <- read.csv("../data/appointments.csv")

# Revenue by day
revenue_by_day <- appointments %>%
  dplyr::filter(status == "completed") %>%
  mutate(total = price + ifelse(is.na(tip), 0, tip)) %>%
  group_by(date) %>%
  summarise(total_revenue = sum(total))

png("plots/revenue_by_day.png")
ggplot(revenue_by_day, aes(x = as.Date(date), y = total_revenue)) +
  geom_col() +
  xlab("Date") +
  ylab("Total revenue")
dev.off()

# Service popularity
service_pop <- appointments %>%
  group_by(service_type) %>%
  summarise(count = n())

png("plots/service_popularity.png")
ggplot(service_pop, aes(x = service_type, y = count)) +
  geom_col() +
  xlab("Service") +
  ylab("Count")
dev.off()
