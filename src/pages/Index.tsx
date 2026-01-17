import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Vinyl {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  price: number;
  image: string;
}

interface CartItem extends Vinyl {
  quantity: number;
}

const VINYL_DATA: Vinyl[] = [
  { id: 1, title: "Cosmic Journey", artist: "The Psychedelic Explorers", genre: "Rock", year: 1973, price: 2499, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/fd0e988b-9e4c-4b44-87bd-1c0ac4983205.jpg" },
  { id: 2, title: "Midnight Jazz Sessions", artist: "Miles & The Collective", genre: "Jazz", year: 1981, price: 3299, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/b42bffed-f60e-47eb-9d03-ca3373b9a456.jpg" },
  { id: 3, title: "Disco Fever Dreams", artist: "Groove Machine", genre: "Disco", year: 1978, price: 1999, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/23791e8f-48de-4326-9e8f-53b14a79c799.jpg" },
  { id: 4, title: "Electric Nights", artist: "The Synth Warriors", genre: "Electronic", year: 1984, price: 2799, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/fd0e988b-9e4c-4b44-87bd-1c0ac4983205.jpg" },
  { id: 5, title: "Soulful Vibrations", artist: "Aretha & Friends", genre: "Soul", year: 1975, price: 2299, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/b42bffed-f60e-47eb-9d03-ca3373b9a456.jpg" },
  { id: 6, title: "Funky Revolution", artist: "Parliament Collective", genre: "Funk", year: 1977, price: 2599, image: "https://cdn.poehali.dev/projects/0552c9a8-91a4-43a0-a04a-b9201e8cd91e/files/23791e8f-48de-4326-9e8f-53b14a79c799.jpg" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'catalog' | 'about' | 'contacts'>('home');

  const genres = ['all', ...Array.from(new Set(VINYL_DATA.map(v => v.genre)))];
  const years = ['all', ...Array.from(new Set(VINYL_DATA.map(v => v.year.toString()))).sort()];

  const filteredVinyls = VINYL_DATA.filter(vinyl => {
    const matchesSearch = vinyl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vinyl.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || vinyl.genre === selectedGenre;
    const matchesYear = selectedYear === 'all' || vinyl.year.toString() === selectedYear;
    return matchesSearch && matchesGenre && matchesYear;
  });

  const addToCart = (vinyl: Vinyl) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === vinyl.id);
      if (existing) {
        return prev.map(item => 
          item.id === vinyl.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...vinyl, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]">
      <header className="sticky top-0 z-50 bg-[hsl(var(--vinyl-dark))]/95 backdrop-blur-sm border-b-4 border-[hsl(var(--vinyl-gold))]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--vinyl-gold))] flex items-center justify-center vinyl-spin">
                <Icon name="Disc3" size={28} className="text-[hsl(var(--vinyl-dark))]" />
              </div>
              <h1 className="text-3xl font-bold text-[hsl(var(--vinyl-gold))]">VinylVault</h1>
            </div>
            
            <nav className="hidden md:flex gap-6">
              {(['home', 'catalog', 'about', 'contacts'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-lg font-semibold uppercase tracking-wider transition-colors ${
                    activeSection === section 
                      ? 'text-[hsl(var(--vinyl-gold))]' 
                      : 'text-[hsl(var(--vinyl-sand))] hover:text-[hsl(var(--vinyl-gold))]'
                  }`}
                >
                  {section === 'home' ? 'Главная' : 
                   section === 'catalog' ? 'Каталог' :
                   section === 'about' ? 'О магазине' : 'Контакты'}
                </button>
              ))}
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative bg-[hsl(var(--vinyl-gold))] border-[hsl(var(--vinyl-brown))] hover:bg-[hsl(var(--vinyl-sand))]">
                  <Icon name="ShoppingCart" size={24} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{cartCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[hsl(var(--card))]">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold text-[hsl(var(--vinyl-dark))]">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-[hsl(var(--muted-foreground))] text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-3 p-3 bg-[hsl(var(--muted))] rounded-lg">
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{item.title}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.artist}</p>
                            <p className="text-sm font-bold text-[hsl(var(--vinyl-brown))]">{item.price / 100} ₽ × {item.quantity}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-[hsl(var(--border))]">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold">Итого:</span>
                          <span className="text-2xl font-bold text-[hsl(var(--vinyl-brown))]">{cartTotal / 100} ₽</span>
                        </div>
                        <Button className="w-full bg-[hsl(var(--vinyl-brown))] hover:bg-[hsl(var(--vinyl-gold))] text-white">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-12">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(var(--vinyl-brown))] to-[hsl(var(--vinyl-dark))] p-12 text-white">
              <div className="relative z-10">
                <h2 className="text-6xl font-bold mb-4">Винтажные виниловые пластинки</h2>
                <p className="text-xl mb-8 text-[hsl(var(--vinyl-sand))]">Коллекция легендарных альбомов 70-80х годов</p>
                <Button 
                  onClick={() => setActiveSection('catalog')}
                  size="lg" 
                  className="bg-[hsl(var(--vinyl-gold))] hover:bg-[hsl(var(--vinyl-sand))] text-[hsl(var(--vinyl-dark))] font-bold text-lg"
                >
                  Перейти в каталог
                </Button>
              </div>
              <div className="absolute right-0 top-0 opacity-20 vinyl-spin">
                <Icon name="Disc3" size={300} />
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6 text-[hsl(var(--vinyl-dark))]">Избранные альбомы</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VINYL_DATA.slice(0, 3).map(vinyl => (
                  <Card key={vinyl.id} className="overflow-hidden hover:shadow-2xl transition-all hover:scale-105 bg-[hsl(var(--card))]">
                    <div className="relative group">
                      <img src={vinyl.image} alt={vinyl.title} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Disc3" size={64} className="text-[hsl(var(--vinyl-gold))] vinyl-spin" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg mb-1">{vinyl.title}</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{vinyl.artist}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[hsl(var(--vinyl-brown))]">{vinyl.price / 100} ₽</span>
                        <Button 
                          onClick={() => addToCart(vinyl)}
                          className="bg-[hsl(var(--vinyl-gold))] hover:bg-[hsl(var(--vinyl-brown))] text-[hsl(var(--vinyl-dark))]"
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && (
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[hsl(var(--vinyl-dark))]">Каталог пластинок</h2>
            
            <div className="bg-[hsl(var(--card))] p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Поиск по названию или исполнителю</label>
                  <Input
                    placeholder="Введите название альбома..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[hsl(var(--background))]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Жанр</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-[hsl(var(--background))]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>
                          {genre === 'all' ? 'Все жанры' : genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Год выпуска</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-[hsl(var(--background))]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>
                          {year === 'all' ? 'Все годы' : year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVinyls.map(vinyl => (
                <Card key={vinyl.id} className="overflow-hidden hover:shadow-2xl transition-all hover:scale-105 bg-[hsl(var(--card))]">
                  <div className="relative group">
                    <img src={vinyl.image} alt={vinyl.title} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--vinyl-gold))] text-[hsl(var(--vinyl-dark))]">
                      {vinyl.year}
                    </Badge>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="Disc3" size={48} className="text-[hsl(var(--vinyl-gold))] vinyl-spin" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">{vinyl.genre}</Badge>
                    <h4 className="font-bold text-lg mb-1">{vinyl.title}</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">{vinyl.artist}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[hsl(var(--vinyl-brown))]">{vinyl.price / 100} ₽</span>
                      <Button 
                        onClick={() => addToCart(vinyl)}
                        size="sm"
                        className="bg-[hsl(var(--vinyl-gold))] hover:bg-[hsl(var(--vinyl-brown))] text-[hsl(var(--vinyl-dark))]"
                      >
                        <Icon name="ShoppingCart" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredVinyls.length === 0 && (
              <p className="text-center text-[hsl(var(--muted-foreground))] py-12">Ничего не найдено</p>
            )}
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-[hsl(var(--vinyl-dark))]">О магазине</h2>
            <Card className="p-8 bg-[hsl(var(--card))]">
              <p className="text-lg leading-relaxed mb-4">
                VinylVault — это магазин для истинных ценителей музыки. Мы специализируемся на винтажных виниловых пластинках эпохи 70-80х годов.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                В нашей коллекции вы найдёте редкие альбомы легендарных исполнителей, от психоделического рока до диско и джаза. Каждая пластинка тщательно проверена и находится в отличном состоянии.
              </p>
              <p className="text-lg leading-relaxed">
                Мы гарантируем подлинность всех наших пластинок и предоставляем бесплатную доставку по России при заказе от 5000 ₽.
              </p>
            </Card>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-[hsl(var(--vinyl-dark))]">Контакты</h2>
            <Card className="p-8 bg-[hsl(var(--card))]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={24} className="text-[hsl(var(--vinyl-brown))]" />
                  <span className="text-lg">г. Москва, ул. Винтажная, д. 70</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={24} className="text-[hsl(var(--vinyl-brown))]" />
                  <span className="text-lg">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={24} className="text-[hsl(var(--vinyl-brown))]" />
                  <span className="text-lg">info@vinylvault.ru</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={24} className="text-[hsl(var(--vinyl-brown))]" />
                  <span className="text-lg">Пн-Пт: 10:00 - 20:00, Сб-Вс: 11:00 - 18:00</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="mt-16 bg-[hsl(var(--vinyl-dark))] text-[hsl(var(--vinyl-sand))] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Disc3" size={32} className="text-[hsl(var(--vinyl-gold))]" />
            <span className="text-2xl font-bold">VinylVault</span>
          </div>
          <p>© 2026 VinylVault. Винтажные виниловые пластинки с душой.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
