import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/sdk/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  BookOpen, 
  Library, 
  Users, 
  BookmarkCheck, 
  ScanBarcode, 
  Search,
  UserPlus,
  BookHeart,
  LogOut,
  Check
} from 'lucide-react'

interface Book {
  id: string
  isbn: string
  title: string
  author: string
  cover_url?: string
  summary?: string
  published_year?: number
}

interface UserBook {
  id: string
  book_id: string
  is_read: boolean
  added_at: string
  books: Book
}

interface UserBookData {
  id: string
  user_id: string
  book_id: string
  is_read: boolean
  added_at: string
}

interface Friendship {
  id: string
  user_id: string
  friend_id: string
  status: string
  created_at: string
}

interface LendingRequest {
  id: string
  book_id: string
  owner_id: string
  borrower_id: string
  status: string
  requested_at: string
}



export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('home')
  
  // Stats
  const [totalBooks, setTotalBooks] = useState(0)
  const [readBooks, setReadBooks] = useState(0)
  const [friendsCount, setFriendsCount] = useState(0)
  const [activeLendings, setActiveLendings] = useState(0)
  
  // Collection
  const [userBooks, setUserBooks] = useState<UserBook[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // ISBN Entry
  const [isbn, setIsbn] = useState('')
  const [isbnLoading, setIsbnLoading] = useState(false)
  const [bookDetails, setBookDetails] = useState<Book | null>(null)
  
  // Friends (for future implementation)
  const [friendUsername, setFriendUsername] = useState('')

  const loadDashboardData = useCallback(async () => {
    if (!user) return

    try {
      // Load user books
      const { data: userBooksData, error: userBooksError } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', user.id)

      if (userBooksError) throw userBooksError

      // If we have user books, fetch the book details separately
      if (userBooksData && userBooksData.length > 0) {
        const typedUserBooks = userBooksData as UserBookData[]
        const bookIds = typedUserBooks.map((ub) => ub.book_id)
        
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*')
          .in('id', bookIds)

        if (booksError) throw booksError

        const typedBooks = (booksData || []) as Book[]

        // Join the data manually
        const joinedBooks: UserBook[] = typedUserBooks.map((ub) => ({
          ...ub,
          books: typedBooks.find((b) => b.id === ub.book_id) || {
            id: '',
            isbn: '',
            title: 'Unknown',
            author: 'Unknown'
          }
        }))

        setUserBooks(joinedBooks)
        setTotalBooks(joinedBooks.length)
        setReadBooks(joinedBooks.filter((b: UserBook) => b.is_read).length)
      } else {
        setUserBooks([])
        setTotalBooks(0)
        setReadBooks(0)
      }

      // Load friends count
      const { data: friendsList, error: friendsError } = await supabase
        .from('friendships')
        .select('*')
        .eq('status', 'accepted')

      if (!friendsError && friendsList) {
        const typedFriendships = friendsList as Friendship[]
        // Filter to only count friendships where the user is involved
        const userFriendships = typedFriendships.filter(
          (f) => f.user_id === user.id || f.friend_id === user.id
        )
        setFriendsCount(userFriendships.length)
      }

      // Load lending requests count
      const { data: ownerLendings, error: ownerError } = await supabase
        .from('lending_requests')
        .select('*')
        .eq('owner_id', user.id)

      const { data: borrowerLendings, error: borrowerError } = await supabase
        .from('lending_requests')
        .select('*')
        .eq('borrower_id', user.id)

      if (!ownerError && !borrowerError) {
        const allLendings: LendingRequest[] = [
          ...((ownerLendings || []) as LendingRequest[]), 
          ...((borrowerLendings || []) as LendingRequest[])
        ]
        const activeLendingsCount = allLendings.filter(
          (l) => l.status === 'pending' || l.status === 'approved'
        ).length
        setActiveLendings(activeLendingsCount)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user, loadDashboardData])

  const fetchBookByISBN = async () => {
    if (!isbn.trim()) {
      toast({ title: "Please enter an ISBN", variant: "destructive" })
      return
    }

    setIsbnLoading(true)
    setBookDetails(null)
    
    try {
      // Check if book exists in our database
      const { data: existingBook } = await supabase
        .from('books')
        .select('*')
        .eq('isbn', isbn)
        .single()

      if (existingBook) {
        setBookDetails(existingBook)
        setIsbnLoading(false)
        return
      }

      // Fetch from Google Books API
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch book data`)
      }

      const data = await response.json()

      // Check if any results were returned
      if (!data.items || data.items.length === 0) {
        toast({ 
          title: "Book not found", 
          description: "No book found with this ISBN. Please verify the ISBN is correct.", 
          variant: "destructive" 
        })
        setIsbnLoading(false)
        return
      }

      const volumeInfo = data.items[0].volumeInfo

      // Extract published year from publishedDate (format: "YYYY-MM-DD" or "YYYY")
      let published_year: number | null = null
      if (volumeInfo.publishedDate) {
        const yearMatch = volumeInfo.publishedDate.match(/^\d{4}/)
        if (yearMatch) {
          published_year = parseInt(yearMatch[0])
        }
      }

      const bookInfo: Book = {
        id: '', // Will be generated by database
        isbn,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        cover_url: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        summary: volumeInfo.description || null,
        published_year: published_year || undefined
      }

      setBookDetails(bookInfo)
      toast({ 
        title: "Book found!", 
        description: `"${bookInfo.title}" by ${bookInfo.author}` 
      })
    } catch (error) {
      console.error('Error fetching book:', error)
      toast({ 
        title: "Error fetching book", 
        description: error instanceof Error ? error.message : "Please try again", 
        variant: "destructive" 
      })
    } finally {
      setIsbnLoading(false)
    }
  }

  const addBookToCollection = async () => {
    if (!user || !bookDetails) return

    try {
      // First, create or get the book
      const { data: book, error: bookError } = await supabase
        .from('books')
        .upsert({
          isbn: bookDetails.isbn,
          title: bookDetails.title,
          author: bookDetails.author,
          cover_url: bookDetails.cover_url,
          summary: bookDetails.summary,
          published_year: bookDetails.published_year
        }, { onConflict: 'isbn' })
        .select()
        .single()

      if (bookError) throw bookError

      // Add to user's collection
      const { error: userBookError } = await supabase
        .from('user_books')
        .insert({
          user_id: user.id,
          book_id: book.id,
          is_read: false
        })

      if (userBookError) {
        if (userBookError.code === '23505') {
          toast({ title: "Already in collection", description: "This book is already in your collection" })
        } else {
          throw userBookError
        }
        return
      }

      toast({ title: "Book added!", description: `${bookDetails.title} added to your collection` })
      setBookDetails(null)
      setIsbn('')
      loadDashboardData()
    } catch (error) {
      toast({ title: "Error adding book", description: "Please try again", variant: "destructive" })
    }
  }

  const toggleReadStatus = async (userBookId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_books')
        .update({ is_read: !currentStatus })
        .eq('id', userBookId)

      if (error) throw error

      loadDashboardData()
      toast({ title: "Updated!", description: "Reading status updated" })
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" })
    }
  }

  const filteredBooks = userBooks.filter(ub => 
    ub.books.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ub.books.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">BookHarmony</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Library className="h-5 w-5 text-primary" />
                Total Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalBooks}</div>
              <p className="text-xs text-muted-foreground mt-1">In your collection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-accent" />
                Books Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{readBooks}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0}% completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{friendsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Book buddies</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookHeart className="h-5 w-5 text-accent" />
                Active Lendings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{activeLendings}</div>
              <p className="text-xs text-muted-foreground mt-1">Books in circulation</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home">
              <Library className="h-4 w-4 mr-2" />
              My Collection
            </TabsTrigger>
            <TabsTrigger value="add">
              <ScanBarcode className="h-4 w-4 mr-2" />
              Add Book
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="lending">
              <BookHeart className="h-4 w-4 mr-2" />
              Lending
            </TabsTrigger>
          </TabsList>

          {/* My Collection Tab */}
          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Book Collection</CardTitle>
                <CardDescription>Browse and manage your personal library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {userBooks.length === 0 ? "No books in your collection yet. Add your first book!" : "No books found matching your search."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBooks.map((userBook) => (
                      <Card key={userBook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {userBook.books.cover_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={userBook.books.cover_url}
                              alt={userBook.books.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg line-clamp-1">{userBook.books.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{userBook.books.author}</p>
                          {userBook.books.summary && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{userBook.books.summary}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge variant={userBook.is_read ? "default" : "secondary"}>
                              {userBook.is_read ? "Read" : "Unread"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleReadStatus(userBook.id, userBook.is_read)}
                            >
                              {userBook.is_read ? "Mark Unread" : "Mark Read"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Book Tab */}
          <TabsContent value="add" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScanBarcode className="h-5 w-5" />
                    ISBN Entry
                  </CardTitle>
                  <CardDescription>Enter ISBN to fetch book details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN (10 or 13 digits)</Label>
                    <Input
                      id="isbn"
                      placeholder="9780143127741"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchBookByISBN()}
                    />
                  </div>
                  <Button
                    onClick={fetchBookByISBN}
                    disabled={isbnLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isbnLoading ? "Fetching..." : "Fetch Book Details"}
                  </Button>
                </CardContent>
              </Card>

              {bookDetails && (
                <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
                  <CardHeader>
                    <CardTitle>Book Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bookDetails.cover_url && (
                      <img
                        src={bookDetails.cover_url}
                        alt={bookDetails.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{bookDetails.title}</h3>
                      <p className="text-muted-foreground">{bookDetails.author}</p>
                      {bookDetails.summary && (
                        <p className="text-sm text-muted-foreground mt-2">{bookDetails.summary}</p>
                      )}
                    </div>
                    <Button
                      onClick={addBookToCollection}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Add to Collection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Friends Management</CardTitle>
                <CardDescription>Connect with fellow book lovers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter friend's username"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                  />
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>Friends feature coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lending Tab */}
          <TabsContent value="lending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lending Requests</CardTitle>
                <CardDescription>Manage book lending with friends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookHeart className="h-16 w-16 mx-auto mb-4" />
                  <p>Lending feature coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


