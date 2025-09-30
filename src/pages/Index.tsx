import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ListChecks, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpellingWord {
  word: string;
  week: number;
}

const Index = () => {
  const [words, setWords] = useState<SpellingWord[]>(() => {
    const saved = localStorage.getItem("spellingWords");
    return saved ? JSON.parse(saved) : [];
  });
  const [weekNumber, setWeekNumber] = useState("");
  const [newWords, setNewWords] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [testWords, setTestWords] = useState<string[]>([]);
  const { toast } = useToast();

  const saveWords = (updatedWords: SpellingWord[]) => {
    setWords(updatedWords);
    localStorage.setItem("spellingWords", JSON.stringify(updatedWords));
  };

  const handleAddWords = () => {
    if (!weekNumber || !newWords.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter a week number and some words.",
        variant: "destructive",
      });
      return;
    }

    const wordList = newWords
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (wordList.length === 0) {
      toast({
        title: "No words found",
        description: "Please enter at least one word.",
        variant: "destructive",
      });
      return;
    }

    const newEntries = wordList.map((word) => ({
      word,
      week: parseInt(weekNumber),
    }));

    saveWords([...words, ...newEntries]);
    setNewWords("");
    setWeekNumber("");
    toast({
      title: "Words added! 🎉",
      description: `Added ${wordList.length} words to week ${weekNumber}.`,
    });
  };

  const generateTest = () => {
    if (words.length < 10) {
      toast({
        title: "Need more words",
        description: "You need at least 10 words to generate a test.",
        variant: "destructive",
      });
      return;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10).map((w) => w.word);
    setTestWords(selected);
    toast({
      title: "Test ready! ✨",
      description: "Here are 10 random words to practice.",
    });
  };

  const weeks = Array.from(new Set(words.map((w) => w.week))).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">Spelling Practice</h1>
          <p className="text-muted-foreground">Track your weekly spelling words and practice!</p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Add Words
            </TabsTrigger>
            <TabsTrigger value="view" className="gap-2">
              <ListChecks className="h-4 w-4" />
              View Words
            </TabsTrigger>
            <TabsTrigger value="test" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Test Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Spelling Words</CardTitle>
                <CardDescription>Enter the week number and your spelling words (one per line)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="week">Week Number</Label>
                  <Input
                    id="week"
                    type="number"
                    placeholder="e.g., 1"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="words">Spelling Words</Label>
                  <textarea
                    id="words"
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter words, one per line&#10;example&#10;practice&#10;spelling"
                    value={newWords}
                    onChange={(e) => setNewWords(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddWords} className="w-full">
                  Add Words
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle>View Spelling Words by Week</CardTitle>
                <CardDescription>Select a week to see all the words</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeks.length === 0 ? (
                  <p className="text-center text-muted-foreground">No words added yet. Start by adding some words!</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {weeks.map((week) => (
                        <Button
                          key={week}
                          variant={selectedWeek === week ? "default" : "outline"}
                          onClick={() => setSelectedWeek(week)}
                        >
                          Week {week}
                        </Button>
                      ))}
                    </div>
                    {selectedWeek !== null && (
                      <div className="rounded-lg border bg-card p-4">
                        <h3 className="mb-3 text-lg font-semibold">Week {selectedWeek} Words</h3>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {words
                            .filter((w) => w.week === selectedWeek)
                            .map((w, idx) => (
                              <li key={idx} className="rounded-md bg-accent/50 px-3 py-2">
                                {w.word}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Practice Test</CardTitle>
                <CardDescription>Generate a random test of 10 words from all your weeks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateTest} className="w-full">
                  Generate Random Test
                </Button>
                {testWords.length > 0 && (
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="mb-3 text-lg font-semibold">Your Test Words</h3>
                    <ol className="space-y-2">
                      {testWords.map((word, idx) => (
                        <li key={idx} className="rounded-md bg-accent/50 px-3 py-2">
                          {idx + 1}. {word}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
