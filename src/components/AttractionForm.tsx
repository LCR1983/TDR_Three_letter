'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Area {
  id: string
  park: string
  code: string
  name: string
}

interface AttractionFormData {
  id?: string
  park: string
  areaId: string
  threeLetterCode: string
  name: string
  englishName: string
  openDate: string
  sponsor: string
  rideSystem: string
  isIndoor: boolean
  durationMin: string
  durationSec: string
  capacity: string
  vehicleNote: string
  promiseTime: string
  dispatchTime: string
  rotationClass: string
  rotationNote: string
  hasDPA: boolean
  hasSingleRider: boolean
  passNote: string
  heightMin: string
  restrictionNote: string
  bgs: string
  details: string
  operationNotes: string
  status: string
  statusNote: string
  sortOrder: string
}

interface AttractionFormProps {
  initial?: Partial<AttractionFormData>
  attractionId?: string
}

const defaultForm: AttractionFormData = {
  park: 'TDL',
  areaId: '',
  threeLetterCode: '',
  name: '',
  englishName: '',
  openDate: '',
  sponsor: '',
  rideSystem: '',
  isIndoor: true,
  durationMin: '',
  durationSec: '',
  capacity: '',
  vehicleNote: '',
  promiseTime: '',
  dispatchTime: '',
  rotationClass: '',
  rotationNote: '',
  hasDPA: false,
  hasSingleRider: false,
  passNote: '',
  heightMin: '',
  restrictionNote: '',
  bgs: '',
  details: '',
  operationNotes: '',
  status: 'DRAFT',
  statusNote: '',
  sortOrder: '0',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-4 mt-8 border-b border-[#C9A84C]/15 pb-2">
      {children}
    </h2>
  )
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="block text-[#e8dfc8]/70 text-sm mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[#e8dfc8]/30 text-xs mt-1">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full bg-[#071529] border border-[#C9A84C]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors'

const selectClass =
  'w-full bg-[#071529] border border-[#C9A84C]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors'

export function AttractionForm({ initial, attractionId }: AttractionFormProps) {
  const router = useRouter()
  const [areas, setAreas] = useState<Area[]>([])
  const [form, setForm] = useState<AttractionFormData>({ ...defaultForm, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/areas')
      .then((r) => r.json())
      .then(setAreas)
  }, [])

  const filteredAreas = areas.filter((a) => a.park === form.park)

  function set(key: keyof AttractionFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const totalSec =
      (parseInt(form.durationMin) || 0) * 60 + (parseInt(form.durationSec) || 0)

    const payload = {
      park: form.park,
      areaId: form.areaId,
      threeLetterCode: form.threeLetterCode.toUpperCase(),
      name: form.name,
      englishName: form.englishName,
      openDate: form.openDate || null,
      sponsor: form.sponsor || null,
      rideSystem: form.rideSystem || null,
      isIndoor: form.isIndoor,
      durationSec: totalSec > 0 ? totalSec : null,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      vehicleNote: form.vehicleNote || null,
      promiseTime: form.promiseTime ? parseInt(form.promiseTime) : null,
      dispatchTime: form.dispatchTime ? parseInt(form.dispatchTime) : null,
      rotationClass: form.rotationClass || null,
      rotationNote: form.rotationNote || null,
      hasDPA: form.hasDPA,
      hasSingleRider: form.hasSingleRider,
      passNote: form.passNote || null,
      heightMin: form.heightMin ? parseInt(form.heightMin) : null,
      restrictionNote: form.restrictionNote || null,
      bgs: form.bgs || null,
      details: form.details || null,
      operationNotes: form.operationNotes || null,
      status: form.status,
      statusNote: form.statusNote || null,
      sortOrder: parseInt(form.sortOrder) || 0,
    }

    try {
      const url = attractionId
        ? `/api/admin/attractions/${attractionId}`
        : '/api/admin/attractions'
      const method = attractionId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/attractions')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? '保存に失敗しました')
      }
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      {/* ─── セクション1: 基本情報 ─── */}
      <SectionTitle>基本情報</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="パーク" required>
          <select
            value={form.park}
            onChange={(e) => {
              set('park', e.target.value)
              set('areaId', '')
            }}
            className={selectClass}
          >
            <option value="TDL">TDL（東京ディズニーランド）</option>
            <option value="TDS">TDS（東京ディズニーシー）</option>
          </select>
        </FormField>

        <FormField label="エリア" required>
          <select
            value={form.areaId}
            onChange={(e) => set('areaId', e.target.value)}
            className={selectClass}
            required
          >
            <option value="">エリアを選択</option>
            {filteredAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.code} - {a.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="スリーレターコード" required hint="2〜4文字の英大文字">
          <input
            type="text"
            value={form.threeLetterCode}
            onChange={(e) => set('threeLetterCode', e.target.value.toUpperCase())}
            maxLength={4}
            required
            placeholder="PRT"
            className={inputClass + ' font-mono tracking-widest'}
          />
        </FormField>

        <FormField label="ステータス" required>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className={selectClass}
          >
            <option value="DRAFT">下書き</option>
            <option value="PUBLISHED">公開中</option>
            <option value="MAINTENANCE">休止中</option>
            <option value="CLOSED">閉鎖済み</option>
          </select>
        </FormField>
      </div>

      <FormField label="アトラクション名（日本語）" required>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
          placeholder="カリブの海賊"
          className={inputClass}
        />
      </FormField>

      <FormField label="アトラクション名（英語）">
        <input
          type="text"
          value={form.englishName}
          onChange={(e) => set('englishName', e.target.value)}
          placeholder="Pirates of the Caribbean"
          className={inputClass}
        />
      </FormField>

      {form.status === 'MAINTENANCE' && (
        <FormField label="休止補足">
          <input
            type="text"
            value={form.statusNote}
            onChange={(e) => set('statusNote', e.target.value)}
            placeholder="例: 2024年3月より長期リハブ中"
            className={inputClass}
          />
        </FormField>
      )}

      {/* ─── セクション2: 施設情報 ─── */}
      <SectionTitle>施設情報</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="オープン日">
          <input
            type="text"
            value={form.openDate}
            onChange={(e) => set('openDate', e.target.value)}
            placeholder="1983年4月15日"
            className={inputClass}
          />
        </FormField>

        <FormField label="スポンサー">
          <input
            type="text"
            value={form.sponsor}
            onChange={(e) => set('sponsor', e.target.value)}
            placeholder="スポンサー名"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="ライドシステム">
        <input
          type="text"
          value={form.rideSystem}
          onChange={(e) => set('rideSystem', e.target.value)}
          placeholder="オムニムーバー、水流ライド、トラックレスなど"
          className={inputClass}
        />
      </FormField>

      <FormField label="施設形態">
        <div className="flex gap-4">
          {[
            { value: true, label: '屋内' },
            { value: false, label: '屋外' },
          ].map((opt) => (
            <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isIndoor"
                checked={form.isIndoor === opt.value}
                onChange={() => set('isIndoor', opt.value)}
                className="accent-[#C9A84C]"
              />
              <span className="text-white text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </FormField>

      {/* ─── セクション3: 所要・定員 ─── */}
      <SectionTitle>所要・定員</SectionTitle>

      <FormField label="所要時間">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            value={form.durationMin}
            onChange={(e) => set('durationMin', e.target.value)}
            placeholder="0"
            className={inputClass + ' w-24'}
          />
          <span className="text-[#e8dfc8]/50 text-sm">分</span>
          <input
            type="number"
            min="0"
            max="59"
            value={form.durationSec}
            onChange={(e) => set('durationSec', e.target.value)}
            placeholder="0"
            className={inputClass + ' w-24'}
          />
          <span className="text-[#e8dfc8]/50 text-sm">秒</span>
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="定員（1サイクル）" hint="単位: 人">
          <input
            type="number"
            min="0"
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            placeholder="144"
            className={inputClass}
          />
        </FormField>

        <FormField label="ビークル構成">
          <input
            type="text"
            value={form.vehicleNote}
            onChange={(e) => set('vehicleNote', e.target.value)}
            placeholder="8名×12台"
            className={inputClass}
          />
        </FormField>
      </div>

      {/* ─── セクション4: オペレーション ─── */}
      <SectionTitle>オペレーション情報</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="プロミスタイム" hint="単位: 分">
          <input
            type="number"
            min="0"
            value={form.promiseTime}
            onChange={(e) => set('promiseTime', e.target.value)}
            placeholder="15"
            className={inputClass}
          />
        </FormField>

        <FormField label="ディスパッチ所要時間" hint="単位: 秒">
          <input
            type="number"
            min="0"
            value={form.dispatchTime}
            onChange={(e) => set('dispatchTime', e.target.value)}
            placeholder="120"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="回転効率クラス">
          <select
            value={form.rotationClass}
            onChange={(e) => set('rotationClass', e.target.value)}
            className={selectClass}
          >
            <option value="">未設定</option>
            {['E', 'D', 'C', 'B', 'A'].map((c) => (
              <option key={c} value={c}>
                {c}クラス
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="回転効率補足">
          <input
            type="text"
            value={form.rotationNote}
            onChange={(e) => set('rotationNote', e.target.value)}
            placeholder="雨天時はD相当"
            className={inputClass}
          />
        </FormField>
      </div>

      {/* ─── セクション5: パス・サービス ─── */}
      <SectionTitle>パス・サービス</SectionTitle>

      <div className="space-y-3">
        {[
          { key: 'hasDPA' as const, label: 'ディズニー・プレミアアクセス（DPA）対象' },
          { key: 'hasSingleRider' as const, label: 'シングルライダー対象' },
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form[item.key] as boolean}
              onChange={(e) => set(item.key, e.target.checked)}
              className="w-4 h-4 accent-[#C9A84C]"
            />
            <span className="text-white text-sm">{item.label}</span>
          </label>
        ))}

        <FormField label="パス関連補足">
          <input
            type="text"
            value={form.passNote}
            onChange={(e) => set('passNote', e.target.value)}
            placeholder="補足情報"
            className={inputClass}
          />
        </FormField>
      </div>

      {/* ─── セクション6: 利用制限 ─── */}
      <SectionTitle>利用制限</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="最低身長制限" hint="なければ空欄 (cm)">
          <input
            type="number"
            min="0"
            value={form.heightMin}
            onChange={(e) => set('heightMin', e.target.value)}
            placeholder="102"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="利用制限補足">
        <input
          type="text"
          value={form.restrictionNote}
          onChange={(e) => set('restrictionNote', e.target.value)}
          placeholder="妊娠中の方・腰痛の方はご利用いただけません"
          className={inputClass}
        />
      </FormField>

      {/* ─── セクション7: コンテンツ ─── */}
      <SectionTitle>コンテンツ（Markdown）</SectionTitle>

      <FormField label="バックグラウンドストーリー">
        <div data-color-mode="dark">
          <MDEditor
            value={form.bgs}
            onChange={(v) => set('bgs', v ?? '')}
            height={200}
            preview="edit"
          />
        </div>
      </FormField>

      <FormField label="アトラクション詳細">
        <div data-color-mode="dark">
          <MDEditor
            value={form.details}
            onChange={(v) => set('details', v ?? '')}
            height={200}
            preview="edit"
          />
        </div>
      </FormField>

      <FormField label="運営メモ">
        <div data-color-mode="dark">
          <MDEditor
            value={form.operationNotes}
            onChange={(v) => set('operationNotes', v ?? '')}
            height={200}
            preview="edit"
          />
        </div>
      </FormField>

      {/* ─── セクション8: その他 ─── */}
      <SectionTitle>その他</SectionTitle>

      <FormField label="表示順" hint="小さい数字が先頭に表示されます">
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => set('sortOrder', e.target.value)}
          className={inputClass + ' w-32'}
        />
      </FormField>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4 pt-4 pb-8">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 disabled:opacity-50 text-[#071529] font-bold px-8 py-3 rounded-lg transition-colors"
        >
          {saving ? '保存中...' : attractionId ? '更新する' : '作成する'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-[#C9A84C]/20 text-[#e8dfc8]/60 hover:text-[#e8dfc8] px-6 py-3 rounded-lg transition-colors text-sm"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
