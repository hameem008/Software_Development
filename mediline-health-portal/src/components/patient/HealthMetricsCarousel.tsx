
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { mockHealthMetrics } from '@/data/mockData';
import { Activity, Heart, Weight, TrendingUp } from 'lucide-react';

const HealthMetricsCarousel = () => {
  const chartConfig = {
    weight: {
      label: "Weight",
      color: "hsl(var(--chart-1))",
    },
    systolic: {
      label: "Systolic",
      color: "hsl(var(--chart-2))",
    },
    diastolic: {
      label: "Diastolic",
      color: "hsl(var(--chart-3))",
    },
    heartRate: {
      label: "Heart Rate",
      color: "hsl(var(--chart-4))",
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weightData = mockHealthMetrics.weight.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const bpData = mockHealthMetrics.bloodPressure.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const hrData = mockHealthMetrics.heartRate.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  // Calculate averages
  const avgWeight = (mockHealthMetrics.weight.reduce((sum, item) => sum + item.value, 0) / mockHealthMetrics.weight.length).toFixed(1);
  const avgSystolic = Math.round(mockHealthMetrics.bloodPressure.reduce((sum, item) => sum + item.systolic, 0) / mockHealthMetrics.bloodPressure.length);
  const avgDiastolic = Math.round(mockHealthMetrics.bloodPressure.reduce((sum, item) => sum + item.diastolic, 0) / mockHealthMetrics.bloodPressure.length);
  const avgHeartRate = Math.round(mockHealthMetrics.heartRate.reduce((sum, item) => sum + item.value, 0) / mockHealthMetrics.heartRate.length);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {/* Weight Progression Slide */}
          <CarouselItem>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Weight className="w-5 h-5 mr-2 text-blue-600" />
                  Weight Progression
                </CardTitle>
                <CardDescription>Your weight trend over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">{avgWeight} kg</p>
                  <p className="text-sm text-gray-600">Average Weight</p>
                </div>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <LineChart data={weightData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-weight)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-weight)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Blood Pressure Slide */}
          <CarouselItem>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Activity className="w-5 h-5 mr-2 text-red-600" />
                  Blood Pressure Tracker
                </CardTitle>
                <CardDescription>Systolic and diastolic readings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-red-600">{avgSystolic}/{avgDiastolic}</p>
                  <p className="text-sm text-gray-600">Average Blood Pressure</p>
                </div>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <LineChart data={bpData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[60, 150]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="var(--color-systolic)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-systolic)" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="var(--color-diastolic)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-diastolic)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Heart Rate Slide */}
          <CarouselItem>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-600" />
                  Heart Rate Monitoring
                </CardTitle>
                <CardDescription>Resting heart rate measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-pink-600">{avgHeartRate} bpm</p>
                  <p className="text-sm text-gray-600">Average Heart Rate</p>
                </div>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart data={hrData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[60, 85]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="value" 
                      fill="var(--color-heartRate)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Summary Slide */}
          <CarouselItem>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Health Summary
                </CardTitle>
                <CardDescription>Overview of your health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Weight className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-600">{avgWeight} kg</p>
                      <p className="text-sm text-gray-600">Average Weight</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold text-red-600">{avgSystolic}/{avgDiastolic}</p>
                      <p className="text-sm text-gray-600">Average BP</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                      <p className="text-2xl font-bold text-pink-600">{avgHeartRate} bpm</p>
                      <p className="text-sm text-gray-600">Average HR</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Last Updated:</p>
                      <p className="text-gray-600">June 1, 2024</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-gray-900">Overall Trend:</p>
                      <p className="text-green-600 font-medium">Improving ↗</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HealthMetricsCarousel;
