export const BADGES = [
  // Hike Count Milestones
  { id: 'first', name: 'First Steps', icon: '🥾', type: 'count', requirement: 1, desc: 'Complete your first hike', milestone: true },
  { id: 'explorer', name: 'Explorer', icon: '🗺️', type: 'count', requirement: 5, desc: 'Complete 5 hikes', milestone: true },
  { id: 'adventurer', name: 'Adventurer', icon: '⛰️', type: 'count', requirement: 10, desc: 'Complete 10 hikes', milestone: true },
  { id: 'trailblazer', name: 'Trailblazer', icon: '🔥', type: 'count', requirement: 25, desc: 'Complete 25 hikes', milestone: true },
  { id: 'legend', name: 'Hiking Legend', icon: '👑', type: 'count', requirement: 50, desc: 'Complete 50 hikes', milestone: true },
  { id: 'century', name: 'Century Club', icon: '💯', type: 'count', requirement: 100, desc: 'Complete 100 hikes', milestone: true },

  // Distance Milestones
  { id: 'distance10', name: 'First 10', icon: '🏃', type: 'distance', requirement: 10, desc: 'Hike 10 total miles', milestone: true },
  { id: 'distance25', name: 'Quarter Century', icon: '🚶', type: 'distance', requirement: 25, desc: 'Hike 25 total miles', milestone: true },
  { id: 'distance50', name: 'Half Century', icon: '🥇', type: 'distance', requirement: 50, desc: 'Hike 50 total miles', milestone: true },
  { id: 'distance100', name: 'Centurion', icon: '⭐', type: 'distance', requirement: 100, desc: 'Hike 100 total miles', milestone: true },
  { id: 'distance250', name: 'Ultra Hiker', icon: '💪', type: 'distance', requirement: 250, desc: 'Hike 250 total miles', milestone: true },
  { id: 'distance500', name: 'Marathon Master', icon: '🏆', type: 'distance', requirement: 500, desc: 'Hike 500 total miles', milestone: true },

  // Elevation Milestones
  { id: 'climber1k', name: 'Hill Climber', icon: '🧗', type: 'elevation', requirement: 1000, desc: 'Climb 1,000 feet', milestone: true },
  { id: 'climber5k', name: 'Peak Climber', icon: '🏔️', type: 'elevation', requirement: 5000, desc: 'Climb 5,000 feet', milestone: true },
  { id: 'kosciuszko', name: 'Kosciuszko Climber', icon: '🏔️', type: 'elevation', requirement: 7310, desc: 'Reach the height of Mt. Kosciuszko (Australia)', milestone: true },
  { id: 'climber10k', name: 'Mountain Goat', icon: '🐐', type: 'elevation', requirement: 10000, desc: 'Climb 10,000 feet', milestone: true },
  { id: 'elbrus', name: 'Elbrus Achiever', icon: '⛰️', type: 'elevation', requirement: 18510, desc: 'Reach the height of Mt. Elbrus (Europe)', milestone: true },
  { id: 'kilimanjaro', name: 'Kilimanjaro Conqueror', icon: '🗻', type: 'elevation', requirement: 19341, desc: 'Reach the height of Mt. Kilimanjaro (Africa)', milestone: true },
  { id: 'denali', name: 'Denali Master', icon: '🏔️', type: 'elevation', requirement: 20310, desc: 'Reach the height of Denali (North America)', milestone: true },
  { id: 'aconcagua', name: 'Aconcagua Champion', icon: '⛰️', type: 'elevation', requirement: 22838, desc: 'Reach the height of Aconcagua (South America)', milestone: true },
  { id: 'everest', name: 'Everest Dreamer', icon: '🏔️', type: 'elevation', requirement: 29032, desc: 'Reach the height of Mt. Everest (Asia)', milestone: true },
  { id: 'climber50k', name: 'Sky Walker', icon: '☁️', type: 'elevation', requirement: 50000, desc: 'Climb 50,000 feet', milestone: true },
  { id: 'climber100k', name: 'Altitude King', icon: '👑', type: 'elevation', requirement: 100000, desc: 'Climb 100,000 feet', milestone: true },

  // Seasonal Badges
  { id: 'spring', name: 'Spring Awakening', icon: '🌸', type: 'seasonal', desc: 'Complete a hike in spring (Mar-May)' },
  { id: 'summer', name: 'Summer Solstice', icon: '☀️', type: 'seasonal', desc: 'Complete a hike in summer (Jun-Aug)' },
  { id: 'fall', name: 'Fall Colors', icon: '🍂', type: 'seasonal', desc: 'Complete a hike in autumn (Sep-Nov)' },
  { id: 'winter', name: 'Winter Warrior', icon: '❄️', type: 'seasonal', desc: 'Complete a hike in winter (Dec-Feb)' },
  { id: 'fourseasons', name: 'Four Seasons', icon: '🌈', type: 'seasonal', desc: 'Complete hikes in all four seasons', requirement: 4, milestone: true },

  // Weather Badges
  { id: 'rainhiker', name: 'Rain Hiker', icon: '🌧️', type: 'weather', desc: 'Complete a hike in the rain' },
  { id: 'fogwalker', name: 'Fog Walker', icon: '🌫️', type: 'weather', desc: 'Hike through fog or mist' },
  { id: 'windrider', name: 'Wind Rider', icon: '🌬️', type: 'weather', desc: 'Hike on a windy day' },
  { id: 'hotstepper', name: 'Hot Stepper', icon: '🌡️', type: 'weather', desc: 'Hike when it\'s over 85°F' },

  // Discovery Badges
  { id: 'waterfall', name: 'Waterfall Finder', icon: '💦', type: 'discovery', desc: 'Find a waterfall' },
  { id: 'wildlife', name: 'Wildlife Spotter', icon: '🦌', type: 'discovery', desc: 'See a wild animal' },
  { id: 'bird', name: 'Bird Watcher', icon: '🦅', type: 'discovery', desc: 'Spot a bird' },
  { id: 'butterfly', name: 'Butterfly Hunter', icon: '🦋', type: 'discovery', desc: 'See a butterfly' },
  { id: 'mushroom', name: 'Fungi Finder', icon: '🍄', type: 'discovery', desc: 'Discover mushrooms' },
  { id: 'wildflower', name: 'Flower Power', icon: '🌸', type: 'discovery', desc: 'Find wildflowers' },
  { id: 'treeclimb', name: 'Tree Hugger', icon: '🌳', type: 'discovery', desc: 'Hug a big tree' },
  { id: 'pinecone', name: 'Pine Collector', icon: '🌲', type: 'discovery', desc: 'Collect a pinecone' },
  { id: 'rock', name: 'Rock Hound', icon: '🪨', type: 'discovery', desc: 'Find a cool rock' },
  { id: 'feather', name: 'Feather Finder', icon: '🪶', type: 'discovery', desc: 'Find a feather' },
  { id: 'stream', name: 'Stream Crosser', icon: '🌊', type: 'discovery', desc: 'Cross a stream' },
  { id: 'cave', name: 'Cave Explorer', icon: '🕳️', type: 'discovery', desc: 'Explore a cave' },
  { id: 'bridge', name: 'Bridge Walker', icon: '🌉', type: 'discovery', desc: 'Cross a bridge' },
  { id: 'sunset', name: 'Sunset Chaser', icon: '🌅', type: 'discovery', desc: 'Watch a sunset' },
  { id: 'sunrise', name: 'Early Bird', icon: '🌄', type: 'discovery', desc: 'Watch a sunrise' },
  { id: 'rainbow', name: 'Rainbow Finder', icon: '🌈', type: 'discovery', desc: 'See a rainbow' },
  { id: 'fog', name: 'Mist Walker', icon: '🌫️', type: 'discovery', desc: 'Hike in fog' },
  { id: 'snow', name: 'Snow Trekker', icon: '❄️', type: 'discovery', desc: 'Hike in snow' },
  { id: 'rain', name: 'Rain Ranger', icon: '🌧️', type: 'discovery', desc: 'Hike in rain' },
  { id: 'frog', name: 'Frog Friend', icon: '🐸', type: 'discovery', desc: 'See a frog' },
  { id: 'squirrel', name: 'Squirrel Scout', icon: '🐿️', type: 'discovery', desc: 'Spot a squirrel' },
  { id: 'snake', name: 'Snake Spotter', icon: '🐍', type: 'discovery', desc: 'See a snake' },
  { id: 'turtle', name: 'Turtle Tracker', icon: '🐢', type: 'discovery', desc: 'Find a turtle' },
  { id: 'rabbit', name: 'Bunny Buddy', icon: '🐰', type: 'discovery', desc: 'Spot a rabbit' },
  { id: 'fish', name: 'Fish Finder', icon: '🐟', type: 'discovery', desc: 'See fish' },
  { id: 'acorn', name: 'Acorn Collector', icon: '🌰', type: 'discovery', desc: 'Collect an acorn' },
  { id: 'leaf', name: 'Leaf Lover', icon: '🍂', type: 'discovery', desc: 'Find a pretty leaf' },
  { id: 'stick', name: 'Walking Stick', icon: '🦯', type: 'discovery', desc: 'Find a hiking stick' },
  { id: 'bee', name: 'Bee Keeper', icon: '🐝', type: 'discovery', desc: 'See a bee' },
  { id: 'spider', name: 'Spider Scout', icon: '🕷️', type: 'discovery', desc: 'Find a spider web' },
  { id: 'tracks', name: 'Track Finder', icon: '🐾', type: 'discovery', desc: 'Find animal tracks' },
  { id: 'berries', name: 'Berry Scout', icon: '🫐', type: 'discovery', desc: 'Find wild berries' },
  { id: 'nest', name: 'Nest Finder', icon: '🪹', type: 'discovery', desc: 'Find a bird nest' },
  { id: 'fossil', name: 'Time Detective', icon: '🦴', type: 'discovery', desc: 'Find a fossil' },
  { id: 'crystal', name: 'Crystal Hunter', icon: '💎', type: 'discovery', desc: 'Find crystals' },
  { id: 'clouds', name: 'Cloud Watcher', icon: '☁️', type: 'discovery', desc: 'Watch clouds' },
  { id: 'wind', name: 'Wind Rider', icon: '💨', type: 'discovery', desc: 'Hike in wind' },
  { id: 'moon', name: 'Moon Gazer', icon: '🌙', type: 'discovery', desc: 'See the moon' },
  { id: 'dragonfly', name: 'Dragon Spotter', icon: '🪰', type: 'discovery', desc: 'See a dragonfly' },
  { id: 'ladybug', name: 'Lucky Bug', icon: '🐞', type: 'discovery', desc: 'Find a ladybug' },
  { id: 'owl', name: 'Night Owl', icon: '🦉', type: 'discovery', desc: 'Hear or see an owl' },
  { id: 'deer', name: 'Deer Whisperer', icon: '🦌', type: 'discovery', desc: 'Get close to a deer' },
  { id: 'caterpillar', name: 'Caterpillar Hunter', icon: '🐛', type: 'discovery', desc: 'Find a caterpillar' },

  // Location Badges
  { id: 'beach', name: 'Beach Comber', icon: '🏖️', type: 'location', desc: 'Hike at beach' },
  { id: 'desert', name: 'Desert Wanderer', icon: '🏜️', type: 'location', desc: 'Hike in desert' },
  { id: 'forest', name: 'Forest Friend', icon: '🌲', type: 'location', desc: 'Hike in forest' },
  { id: 'mountain', name: 'Mountain Master', icon: '⛰️', type: 'location', desc: 'Hike mountains' },
  { id: 'canyon', name: 'Canyon Explorer', icon: '🏞️', type: 'location', desc: 'Hike in canyon' },
  { id: 'lake', name: 'Lake Lover', icon: '🏞️', type: 'location', desc: 'Hike around lake' },
  { id: 'river', name: 'River Runner', icon: '🏞️', type: 'location', desc: 'Hike along river' },
  { id: 'statepark', name: 'Park Visitor', icon: '🏕️', type: 'location', desc: 'Visit state park' },
  { id: 'nationalpark', name: 'Park Ranger', icon: '🎖️', type: 'location', desc: 'Visit national park' },
  { id: 'meadow', name: 'Meadow Walker', icon: '🌾', type: 'location', desc: 'Hike through meadow' },
  { id: 'wetland', name: 'Wetland Explorer', icon: '🦆', type: 'location', desc: 'Visit wetland' },
  { id: 'jungle', name: 'Jungle Trekker', icon: '🌴', type: 'location', desc: 'Hike in jungle' },
  { id: 'prairie', name: 'Prairie Walker', icon: '🌻', type: 'location', desc: 'Hike prairie' },
  { id: 'tundra', name: 'Tundra Explorer', icon: '🧊', type: 'location', desc: 'Hike in tundra' },
  { id: 'volcano', name: 'Volcano Adventurer', icon: '🌋', type: 'location', desc: 'Hike near volcano' },
  { id: 'island', name: 'Island Explorer', icon: '🏝️', type: 'location', desc: 'Hike on an island' },
  { id: 'swamp', name: 'Swamp Stomper', icon: '🐊', type: 'location', desc: 'Explore a swamp' },

  // Special Activity Badges
  { id: 'family', name: 'Family Time', icon: '👨‍👩‍👧‍👦', type: 'special', desc: 'Family hikes together' },
  { id: 'picnic', name: 'Trail Feast', icon: '🧺', type: 'special', desc: 'Have trail picnic' },
  { id: 'camping', name: 'Happy Camper', icon: '⛺', type: 'special', desc: 'Camp overnight' },
  { id: 'stargazing', name: 'Star Gazer', icon: '⭐', type: 'special', desc: 'Stargaze on trail' },
  { id: 'geocache', name: 'Treasure Hunter', icon: '💎', type: 'special', desc: 'Find geocache' },
  { id: 'summit', name: 'Summit Seeker', icon: '🎯', type: 'special', desc: 'Reach a summit' },
  { id: 'lighthouse', name: 'Light Keeper', icon: '🗼', type: 'special', desc: 'Visit lighthouse' },
  { id: 'historic', name: 'Time Traveler', icon: '🏛️', type: 'special', desc: 'Visit historic site' },
  { id: 'photog', name: 'Photo Pro', icon: '📸', type: 'special', desc: 'Take photos' },
  { id: 'notrail', name: 'Off Beaten Path', icon: '🧭', type: 'special', desc: 'Hike off-trail' },
  { id: 'leader', name: 'Trail Leader', icon: '🧑‍🏫', type: 'special', desc: 'Lead the group' },
  { id: 'map', name: 'Navigator', icon: '🗺️', type: 'special', desc: 'Use map/compass' },
  { id: 'journal', name: 'Nature Writer', icon: '📓', type: 'special', desc: 'Write in journal' },
  { id: 'art', name: 'Trail Artist', icon: '🎨', type: 'special', desc: 'Draw/paint on trail' },
  { id: 'song', name: 'Trail Singer', icon: '🎵', type: 'special', desc: 'Sing hiking songs' },
  { id: 'story', name: 'Story Teller', icon: '📚', type: 'special', desc: 'Tell stories' },
  { id: 'game', name: 'Trail Games', icon: '🎲', type: 'special', desc: 'Play trail games' },
  { id: 'clean', name: 'Trail Keeper', icon: '♻️', type: 'special', desc: 'Pick up litter' },
  { id: 'help', name: 'Helpful Hiker', icon: '🤝', type: 'special', desc: 'Help another hiker' },
  { id: 'courage', name: 'Brave Heart', icon: '💪', type: 'special', desc: 'Overcome a fear' },
  { id: 'early', name: 'Morning Glory', icon: '🌞', type: 'special', desc: 'Start before 7am' },
  { id: 'long', name: 'Endurance Pro', icon: '⏱️', type: 'special', desc: 'Hike 4+ hours' },
  { id: 'quiet', name: 'Silent Steps', icon: '🤫', type: 'special', desc: 'Hike in silence' },
  { id: 'backwards', name: 'Backwards Walker', icon: '🔄', type: 'special', desc: 'Walk backwards' },
  { id: 'barefoot', name: 'Nature Feet', icon: '🦶', type: 'special', desc: 'Walk barefoot' },
  { id: 'night', name: 'Night Hiker', icon: '🌃', type: 'special', desc: 'Hike at night' },
  { id: 'firstaid', name: 'Trail Medic', icon: '🩹', type: 'special', desc: 'Use first aid' },
  { id: 'fire', name: 'Fire Starter', icon: '🔥', type: 'special', desc: 'Build safe fire' },
  { id: 'knots', name: 'Knot Master', icon: '🪢', type: 'special', desc: 'Tie useful knots' },
  { id: 'binoculars', name: 'Far Seer', icon: '🔭', type: 'special', desc: 'Use binoculars' },
  { id: 'whistle', name: 'Signal Master', icon: '📣', type: 'special', desc: 'Use safety whistle' },
  { id: 'fishing', name: 'Trail Fisher', icon: '🎣', type: 'special', desc: 'Fish on trail' },
  { id: 'wade', name: 'Water Walker', icon: '👣', type: 'special', desc: 'Wade through water' },
  { id: 'climb', name: 'Rock Climber', icon: '🧗‍♀️', type: 'special', desc: 'Climb rocks' },
  { id: 'meditation', name: 'Trail Zen', icon: '🧘', type: 'special', desc: 'Meditate in nature' },
  { id: 'splash', name: 'Puddle Jumper', icon: '💧', type: 'special', desc: 'Jump in puddles' },
  { id: 'skip', name: 'Stone Skipper', icon: '🪨', type: 'special', desc: 'Skip stones on water' },
  { id: 'scavenger', name: 'Scavenger Pro', icon: '🔍', type: 'special', desc: 'Complete a nature scavenger hunt' },

  // Streak Badges
  { id: 'streak3', name: 'Getting Started', icon: '🌱', type: 'streak', requirement: 3, desc: 'Hike 3 days in a row', milestone: true },
  { id: 'streak7', name: 'Week Warrior', icon: '📅', type: 'streak', requirement: 7, desc: 'Hike 7 days in a row', milestone: true },
  { id: 'streak14', name: 'Fortnight Fighter', icon: '💫', type: 'streak', requirement: 14, desc: 'Hike 14 days in a row', milestone: true },
  { id: 'streak30', name: 'Monthly Master', icon: '🌟', type: 'streak', requirement: 30, desc: 'Hike 30 days in a row', milestone: true },
  { id: 'streak100', name: 'Streak Legend', icon: '🏆', type: 'streak', requirement: 100, desc: 'Hike 100 days in a row', milestone: true },

  // Holiday Badges
  { id: 'newyear', name: 'New Year Trekker', icon: '🎆', type: 'holiday', desc: 'Hike on New Year\'s Day' },
  { id: 'earthday', name: 'Earth Defender', icon: '🌍', type: 'holiday', desc: 'Hike on Earth Day (Apr 22)' },
  { id: 'nationalhike', name: 'National Hero', icon: '🇺🇸', type: 'holiday', desc: 'Hike on National Hiking Day' },
  { id: 'halloween', name: 'Spooky Hiker', icon: '🎃', type: 'holiday', desc: 'Hike on Halloween' },
  { id: 'thanksgiving', name: 'Grateful Hiker', icon: '🦃', type: 'holiday', desc: 'Hike on Thanksgiving' },
  { id: 'birthday', name: 'Birthday Trekker', icon: '🎂', type: 'holiday', desc: 'Hike on your birthday' },
  { id: 'christmas', name: 'Holiday Hiker', icon: '🎄', type: 'holiday', desc: 'Hike during December holidays' },
  { id: 'fullmoon', name: 'Full Moon Walker', icon: '🌕', type: 'holiday', desc: 'Hike during a full moon' },
];

// 🏆 Badge Categories - Colored Pencil Palette
export const BADGE_CATEGORIES = [
  { id: 'count', name: 'Hike Milestones', icon: '🥾', color: '#5a7159', gradient: ['#5a7159', '#7a8f73'], wash: 'rgba(90, 113, 89, 0.15)' },
  { id: 'distance', name: 'Distance Goals', icon: '🏃', color: '#748da6', gradient: ['#748da6', '#6b8fa6'], wash: 'rgba(116, 141, 166, 0.15)' },
  { id: 'elevation', name: 'Elevation Climbs', icon: '⛰️', color: '#8b6f47', gradient: ['#8b6f47', '#b8835a'], wash: 'rgba(139, 111, 71, 0.15)' },
  { id: 'seasonal', name: 'Seasonal', icon: '🌸', color: '#9b8fa6', gradient: ['#9b8fa6', '#a65959'], wash: 'rgba(155, 143, 166, 0.15)' },
  { id: 'weather', name: 'Weather Warriors', icon: '🌧️', color: '#6b8fa6', gradient: ['#6b8fa6', '#748da6'], wash: 'rgba(107, 143, 166, 0.15)' },
  { id: 'discovery', name: 'Nature Discovery', icon: '🔍', color: '#6b8e6b', gradient: ['#6b8e6b', '#7a8f73'], wash: 'rgba(107, 142, 107, 0.15)' },
  { id: 'location', name: 'Locations', icon: '📍', color: '#b8835a', gradient: ['#b8835a', '#d4a574'], wash: 'rgba(184, 131, 90, 0.15)' },
  { id: 'special', name: 'Special Activities', icon: '⭐', color: '#d4a574', gradient: ['#d4a574', '#b8835a'], wash: 'rgba(212, 165, 116, 0.15)' },
  { id: 'streak', name: 'Hiking Streaks', icon: '🔥', color: '#a65959', gradient: ['#a65959', '#b8835a'], wash: 'rgba(166, 89, 89, 0.15)' },
  { id: 'holiday', name: 'Holiday Hikes', icon: '🎉', color: '#d4a574', gradient: ['#d4a574', '#9b8fa6'], wash: 'rgba(212, 165, 116, 0.15)' },
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#4CAF50' },
  { value: 'moderate', label: 'Moderate', color: '#FF9800' },
  { value: 'hard', label: 'Hard', color: '#F44336' },
];

export const FREE_HIKE_LIMIT = 3;
export const SUBSCRIPTION_PRICE = '$0.99/month';

// 📖 Field Journal Design System - Natural Ink & Colored Pencils
export const COLORS = {
  // Paper & Ink
  paper: {
    cream: '#f4f1ea',         // Aged paper
    offWhite: '#faf8f3',      // Fresh page
    aged: '#ede8dc',          // Vintage paper
    shadow: '#d4cfc3',        // Paper shadow
  },

  ink: {
    black: '#2b2b2b',         // Black ink (not pure black - softer)
    dark: '#4a4a4a',          // Dark gray ink
    medium: '#6b6b6b',        // Medium gray
    light: '#8b8b8b',         // Light gray for annotations
    faded: '#b0b0b0',         // Faded ink
  },

  // Colored Pencil Palette (muted, natural)
  pencil: {
    forestGreen: '#5a7159',   // Muted forest green
    mossGreen: '#7a8f73',     // Soft moss
    skyBlue: '#748da6',       // Faded sky
    earthBrown: '#8b6f47',    // Natural brown
    clayOrange: '#b8835a',    // Terra cotta
    leafGreen: '#6b8e6b',     // Gentle leaf
    berryRed: '#a65959',      // Muted berry
    sunYellow: '#d4a574',     // Soft sunshine
    lavender: '#9b8fa6',      // Gentle purple
    seaBlue: '#6b8fa6',       // Calm water
  },

  // Watercolor Washes (very transparent)
  wash: {
    green: 'rgba(90, 113, 89, 0.15)',
    blue: 'rgba(116, 141, 166, 0.15)',
    brown: 'rgba(139, 111, 71, 0.15)',
    yellow: 'rgba(212, 165, 116, 0.15)',
    red: 'rgba(166, 89, 89, 0.15)',
  },

  // UI Colors (using natural palette)
  primary: '#5a7159',           // Forest green pencil
  secondary: '#7a8f73',         // Moss green
  accent: '#b8835a',            // Clay orange

  // Backgrounds
  background: '#f4f1ea',        // Aged paper
  backgroundAlt: '#ede8dc',     // Darker paper
  backgroundLight: '#faf8f3',   // Light paper

  // Text (ink-based)
  text: '#2b2b2b',              // Black ink
  textLight: '#6b6b6b',         // Gray ink
  textMuted: '#8b8b8b',         // Light gray ink
  textAnnotation: '#b0b0b0',    // Faded annotations

  // Borders (sketchy lines)
  border: '#d4cfc3',            // Paper shadow
  borderDark: '#8b8b8b',        // Darker sketch line
  borderInk: '#4a4a4a',         // Ink line

  // Status Colors (muted)
  success: '#6b8e6b',
  error: '#a65959',
  warning: '#d4a574',
  info: '#748da6',
};

// 🎭 Design Tokens
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  badge: '0 4px 12px rgba(45, 90, 46, 0.15)',
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};
