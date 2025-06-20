
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockSymptomEntries } from '@/data/mockData';
import { Heart, Plus, Calendar, TrendingUp } from 'lucide-react';

const SymptomTracker = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState('');
  const [mood, setMood] = useState('');
  const [severity, setSeverity] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [symptomEntries] = useState(mockSymptomEntries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim() || !mood || !severity) {
      toast({
        title: 'Please fill in all fields',
        description: 'All fields are required to add a symptom entry.',
        variant: 'destructive',
      });
      return;
    }

    // Mock save operation
    toast({
      title: 'Symptom entry added!',
      description: 'Your symptoms have been recorded successfully.',
    });

    // Reset form
    setSymptoms('');
    setMood('');
    setSeverity('');
    setIsAddingEntry(false);
  };

  const getSeverityColor = (severityLevel: number) => {
    if (severityLevel <= 2) return 'bg-green-100 text-green-800';
    if (severityLevel <= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMoodColor = (moodValue: string) => {
    switch (moodValue.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Symptom Tracker</h1>
          <p className="text-gray-600">Track your daily symptoms and overall well-being</p>
        </div>
        <Button 
          onClick={() => setIsAddingEntry(true)}
          className="bg-medical-600 hover:bg-medical-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Add New Entry Form */}
      {isAddingEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-medical-600" />
              Add New Symptom Entry
            </CardTitle>
            <CardDescription>
              Record your current symptoms and how you're feeling today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Symptoms & Feelings</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe how you're feeling today, any symptoms you're experiencing..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mood">Overall Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="severity">Severity Level (1-5)</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1">1 - Very Mild</SelectItem>
                      <SelectItem value="2">2 - Mild</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - Severe</SelectItem>
                      <SelectItem value="5">5 - Very Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="bg-medical-600 hover:bg-medical-700">
                  Save Entry
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAddingEntry(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Symptom History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-medical-600" />
            Symptom History
          </CardTitle>
          <CardDescription>
            Your recent symptom entries and health tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {symptomEntries.length > 0 ? (
            <div className="space-y-4">
              {symptomEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{entry.date}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getMoodColor(entry.mood)}>
                        Mood: {entry.mood}
                      </Badge>
                      <Badge className={getSeverityColor(entry.severity)}>
                        Severity: {entry.severity}/5
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{entry.symptoms}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No symptom entries yet</h3>
              <p className="text-gray-600 mb-4">Start tracking your symptoms to monitor your health over time</p>
              <Button 
                onClick={() => setIsAddingEntry(true)}
                className="bg-medical-600 hover:bg-medical-700"
              >
                Add Your First Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>
            Based on your recent symptom tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">Good</div>
              <div className="text-sm text-gray-600">Overall Trend</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">2.5</div>
              <div className="text-sm text-gray-600">Avg Severity</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{symptomEntries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomTracker;
