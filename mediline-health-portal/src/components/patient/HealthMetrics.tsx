
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockHealthMetrics } from '@/data/mockData';
import { Activity, Heart, Weight } from 'lucide-react';

const HealthMetrics = () => {
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Weight</p>
                <p className="text-2xl font-bold text-gray-900">{avgWeight} kg</p>
              </div>
              <Weight className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average BP</p>
                <p className="text-2xl font-bold text-gray-900">{avgSystolic}/{avgDiastolic}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average HR</p>
                <p className="text-2xl font-bold text-gray-900">{avgHeartRate} bpm</p>
              </div>
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Progression</CardTitle>
            <CardDescription>Your weight trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
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

        {/* Blood Pressure Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Tracker</CardTitle>
            <CardDescription>Systolic and diastolic readings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
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

        {/* Heart Rate Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Heart Rate Monitoring</CardTitle>
            <CardDescription>Resting heart rate measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Last Updated:</p>
              <p className="text-gray-600">June 1, 2024</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Overall Trend:</p>
              <p className="text-green-600">Improving ↗</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetrics;
