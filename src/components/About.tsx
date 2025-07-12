import React, { useState } from 'react';
import { Heart, Globe, Server, CreditCard, Code, Gift, Eye, X } from 'lucide-react';

export default function About() {
  const [showModal, setShowModal] = useState<string | null>(null);

  const priceImages = {
    domain: 'https://i.imgur.com/domain-price.jpg', // Replace with actual image
    vps: 'https://i.imgur.com/vps-price.jpg' // Replace with actual image
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Code size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Sistem Paguyuban Digital
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dibuat dengan ❤️ untuk Perumahan Graha Padjajaran
            </p>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Heart size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tentang Developer
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Aplikasi ini dibuat oleh <span className="font-semibold text-blue-600">Abdul Hasan</span> sebagai kontribusi untuk kemajuan digitalisasi perumahan
            </p>
          </div>
        </div>

        {/* Free Services */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Code size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aplikasi Web</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Sistem lengkap untuk manajemen paguyuban</p>
              <div className="text-2xl font-bold text-green-600">GRATIS</div>
              <div className="text-xs text-blue-600 mt-1">Dana pribadi Hasan</div>
            </div>
          </div>

          <div className="group relative">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 relative overflow-hidden">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Globe size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Domain</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Domain khusus untuk perumahan</p>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harga normal: Rp 150.000/tahun</div>
              <div className="text-2xl font-bold text-blue-600">GRATIS</div>
              <div className="text-xs text-blue-600 mt-1">Dana pribadi Hasan</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal('domain');
                }}
                className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title="Lihat bukti harga"
              >
                <Eye size={12} />
              </button>
            </div>
            
            {/* Hover Image */}
            <div className="absolute inset-0 bg-black/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f3f4f6'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='14'%3EDomain Price%3C/text%3E%3C/svg%3E"
                alt="Domain Price"
                className="max-w-full max-h-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="group relative">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 relative overflow-hidden">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Server size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">VPS Hosting</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Server cloud untuk aplikasi</p>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harga normal: Rp 600.000/tahun</div>
              <div className="text-2xl font-bold text-purple-600">GRATIS</div>
              <div className="text-xs text-blue-600 mt-1">Dana pribadi Hasan</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal('vps');
                }}
                className="absolute top-2 right-2 p-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                title="Lihat bukti harga"
              >
                <Eye size={12} />
              </button>
            </div>
            
            {/* Hover Image */}
            <div className="absolute inset-0 bg-black/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f3f4f6'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='14'%3EVPS Price%3C/text%3E%3C/svg%3E"
                alt="VPS Price"
                className="max-w-full max-h-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Gift size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Tujuan Saya</h2>
            <p className="text-xl leading-relaxed">
              Menciptakan solusi digital untuk perumahan yang mudah digunakan, 
              meningkatkan komunikasi antar warga, dan membangun transparansi 
              dalam pengelolaan paguyuban tanpa biaya apapun.
            </p>
          </div>
        </div>

        {/* Donation */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Apresiasi & Dukungan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Sistem ini saya buat untuk membantu kelancaran aktivitas warga di lingkungan perumahan, dan seluruh pembuatannya saya biayai secara pribadi.
            Apabila Bapak/Ibu berkenan memberikan dukungan dalam bentuk donasi atau apresiasi seikhlasnya, saya akan sangat berterima kasih atas kebaikan tersebut.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-2 border-dashed border-green-300 dark:border-green-600">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Informasi Transfer
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-600 mb-2">BCA</div>
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                  7570 xxxx xxxx
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  a.n. <span className="font-semibold">Abdul Hasan</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                * Untuk kebutuhan operasional dan pengembangan sistem
              </p>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Fitur Aplikasi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📰", title: "Info Warga", desc: "Postingan & komunikasi" },
              { icon: "🚨", title: "Sistem Aduan", desc: "Laporan & keluhan" },
              { icon: "💰", title: "Pembayaran", desc: "Iuran & konfirmasi" },
              { icon: "📊", title: "Buku Kas", desc: "Laporan keuangan" },
              { icon: "👥", title: "Kelola Warga", desc: "Manajemen user" },
              { icon: "🔔", title: "Notifikasi", desc: "Real-time alerts" },
              { icon: "📱", title: "Mobile Ready", desc: "Responsive design" },
              { icon: "🌙", title: "Dark Mode", desc: "Theme switching" }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 shadow-lg transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
                  <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            Dibuat dengan 💙 untuk kemajuan Perumahan Graha Padjajaran
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            © 2024 Abdul Hasan - Personal Project
          </p>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {showModal === 'domain' ? 'Harga Domain' : 'Harga VPS Hosting'}
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <img
                src={showModal === 'domain' 
                  ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f9fafb' stroke='%23e5e7eb'/%3E%3Ctext x='200' y='120' text-anchor='middle' dy='.3em' fill='%234b5563' font-family='Arial' font-size='16' font-weight='bold'%3EDomain .com%3C/text%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%23059669' font-family='Arial' font-size='24' font-weight='bold'%3ERp 150.000/tahun%3C/text%3E%3Ctext x='200' y='180' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='12'%3EScreenshot dari Domainesia%3C/text%3E%3C/svg%3E"
                  : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f9fafb' stroke='%23e5e7eb'/%3E%3Ctext x='200' y='120' text-anchor='middle' dy='.3em' fill='%234b5563' font-family='Arial' font-size='16' font-weight='bold'%3EVPS Cloud 1GB%3C/text%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%23dc2626' font-family='Arial' font-size='24' font-weight='bold'%3ERp 50.000/bulan%3C/text%3E%3Ctext x='200' y='180' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='12'%3EScreenshot dari Niagahoster%3C/text%3E%3C/svg%3E"
                }
                alt={showModal === 'domain' ? 'Domain Price' : 'VPS Price'}
                className="w-full rounded-lg border"
              />
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift size={20} className="text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-400">Gratis untuk Graha Padjajaran</span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  {showModal === 'domain' 
                    ? 'Domain senilai Rp 150.000/tahun ini saya berikan gratis dengan dana pribadi untuk kemajuan digitalisasi perumahan.'
                    : 'VPS hosting senilai Rp 600.000/tahun ini saya berikan gratis dengan dana pribadi untuk mendukung sistem paguyuban.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}