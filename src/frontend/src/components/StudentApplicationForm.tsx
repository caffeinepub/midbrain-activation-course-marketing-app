import { useState } from 'react';
import { useSubmitStudentApplication } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Send } from 'lucide-react';

export default function StudentApplicationForm() {
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [courseSelected, setCourseSelected] = useState('');
  const [referredBy, setReferredBy] = useState('');

  const submitMutation = useSubmitStudentApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!studentName.trim()) {
      alert('Please enter student name');
      return;
    }
    if (!fatherName.trim()) {
      alert('Please enter father name');
      return;
    }
    if (!city.trim()) {
      alert('Please enter city');
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      alert('Please enter a valid age');
      return;
    }
    if (!contactNumber.trim()) {
      alert('Please enter contact number');
      return;
    }
    if (!courseSelected) {
      alert('Please select a course');
      return;
    }

    // Combine all information into the backend structure
    // Store additional fields in a structured format within contactInfo
    const contactInfo = JSON.stringify({
      fatherName,
      city,
      age: Number(age),
      contactNumber,
    });

    await submitMutation.mutateAsync({
      name: studentName,
      contactInfo,
      courseSelected,
      referredBy: referredBy.trim() || undefined,
    });

    // Reset form on success
    if (!submitMutation.isError) {
      setStudentName('');
      setFatherName('');
      setCity('');
      setAge('');
      setContactNumber('');
      setCourseSelected('');
      setReferredBy('');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-orange-200">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-900">Student Application Form</CardTitle>
        <CardDescription>Fill in your details to apply for admission</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              type="text"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherName">Father Name *</Label>
            <Input
              id="fatherName"
              type="text"
              placeholder="Enter father name"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              required
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="1"
                max="120"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Apply for which Course *</Label>
            <Select value={courseSelected} onValueChange={setCourseSelected} required>
              <SelectTrigger id="course" className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Midbrain Activation Course</SelectItem>
                <SelectItem value="advanced">Advanced Midbrain Activation Course</SelectItem>
                <SelectItem value="super">Super Advanced Intuition Course</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referredBy">Referred By (Optional)</Label>
            <Input
              id="referredBy"
              type="text"
              placeholder="Enter referrer name (if any)"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
