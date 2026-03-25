package com.g1b.station_back.service;

import com.g1b.station_back.dto.CceSettingsDTO;
import com.g1b.station_back.dto.CceSettingsDTO.BonusTierDTO;
import com.g1b.station_back.model.CceBonusTier;
import com.g1b.station_back.model.CceSetting;
import com.g1b.station_back.repository.CceBonusTierRepository;
import com.g1b.station_back.repository.CceSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CceSettingsService {
    private final CceSettingRepository settingRepository;
    private final CceBonusTierRepository tierRepository;

    public CceSettingsService(CceSettingRepository settingRepository, CceBonusTierRepository tierRepository) {
        this.settingRepository = settingRepository;
        this.tierRepository = tierRepository;
    }

    public CceSettingsDTO getGlobalSettings() {
        CceSetting setting = settingRepository.findAll().stream().findFirst().orElse(new CceSetting());
        List<BonusTierDTO> tiers = tierRepository.findAll().stream()
                .map(t -> new BonusTierDTO(t.getIdTier(), t.getMinAmount(), t.getBonusPercentage()))
                .toList();
        return new CceSettingsDTO(setting.getMinimumCreditAmount(), tiers);
    }

    @Transactional
    public void updateGlobalSettings(CceSettingsDTO dto) {
        CceSetting setting = settingRepository.findAll().stream().findFirst().orElse(new CceSetting());
        setting.setMinimumCreditAmount(dto.minimumCreditAmount());
        settingRepository.save(setting);

        tierRepository.deleteAll();
        List<CceBonusTier> newTiers = dto.bonusTiers().stream()
                .map(t -> new CceBonusTier(t.minAmount(), t.bonusPercentage()))
                .toList();
        tierRepository.saveAll(newTiers);
    }
}